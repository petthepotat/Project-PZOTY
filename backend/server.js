const express = require("express");
const cors = require("cors");
const postgres = require('postgres');
require('dotenv').config();
const aws = require('aws-sdk');
const util = require('util');
const crypto = require('crypto');

// random byte generator
const randomBytes = util.promisify(crypto.randomBytes);

let {PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID, AWS_ACCESS_KEY, AWS_SECRET} = process.env;

// connect to the database
const sql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
});

// create ssql functions
async function getListings() {
    const result = (await sql`SELECT * FROM listings`);

    // convert into json
    const final = {
        "listings": [
        ]
    }
    let listing;
    for (let i = 0; i < result.length; i++) {
        // console.log(result[i]);
        listing = result[i];

        final.listings.push({
            "header": listing._title,
            "description": listing._desc,
            "image": listing._image
        })
    }
    SQL_DATA_CACHE = final;
    // console.log(JSON.stringify(final));
    // console.log(SQL_DATA_CACHE["listings"].length)
    return JSON.stringify(final);
}

async function addListing(id, header, desc, image) {
    await sql`INSERT INTO listings VALUES (${id}, ${header}, ${desc}, ${image});`;
}

// create amazon aws s3 functions
const region = "us-east-1"
const bucketName = "project-pzoty-bucket"
const accessKeyId = AWS_ACCESS_KEY
const secretAccessKey = AWS_SECRET

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
});

async function generateUploadURL(){
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex');

    // console.log(imageName)

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    });

    return await s3.getSignedUrlPromise('putObject', params);
}


// 

// constants
const PORT = 3001;

// create express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// functions
app.get('/', (req, res) => {
    res.status(200).json({
        "message": "You're on the wrong page. Head to https://project-pzoty.vercel.app/"
    })
    res.redirect("https://project-pzoty.vercel.app/")
})

app.get("/listings", async (req, res) => {
    try{
        const listings = await getListings();
        res.status(200).send(listings);
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send("Internal server error");
    }
});

app.post("/upload", async (req, res) => {
    const endpoint = await generateUploadURL();
    // get size of sql database
    var size = (await sql`SELECT COUNT(*) FROM listings`)[0].count;
    console.log(endpoint.toString());
    // add the listing
    await addListing(size, req.body[0], req.body[1], endpoint.toString().split("?")[0])
    // send response after adding to sql server
    .then(() => res.status(200).json({"endpoint": endpoint}))
    // catch errors
    .catch((error) => {
        res.status(500).send("SQL failed to update");
        console.error("Error: ", error);
    });

});

// start server
app.listen(PORT, () => {
    console.log("server has started on port", PORT);
})



