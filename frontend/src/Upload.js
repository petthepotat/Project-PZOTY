import "./Upload.css"
import {useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';


import SERVER from './constants';


const Upload = (props) => {
    // change website title
    useEffect(() => {
        document.title = "Upload a Listing";
    }, []);

    const navigate = useNavigate();
    const [data, setData] = useState(['', '', '']);

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [image, setImage] = useState('');
    
    const [endpoint, setEndpoint] = useState('');


    const submitData = async (event) => {
        event.preventDefault();
        
        // check if valid input data
        if(name === '' || desc === '' || image === '') {
            alert("Invalid data");
            return;
        }
        // send data to the server
        fetch(SERVER + "/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([name, desc, image])
        })
        .then(async (res) => {
            const result = await res.json();
            const file = document.getElementById("imageInput").files[0];

            console.log("RESULT:", result);
            console.log("FILE:", file);

            await fetch(result.endpoint, {
                method: "PUT", 
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: file
            }).then((res) => {
                const imageUrl = result.endpoint.split("?")[0];
                console.log("URL:", imageUrl);
            }).then(() => {
                navigate('/');
            })
        }).catch((error) => {
            alert('There was an error: Please try again with valid data.');
        });
    }

    return (
        <div className="container">
            <h1>Upload Your New Listing</h1>
            <div className="form-div">

                <form onSubmit={submitData}>
<label id="header">
    Title:
    <input type="text" value={name} onChange={(e) => setName(e.target.value)} name="header"/>
</label>
<label>
    Description:
    <input type="text" name="description" value={desc} onChange={(e) => setDesc(e.target.value)}/>
</label>
<label>
    Image:
    <input type="file" name="image" id="imageInput" accept="image/*" onChange={(e) => setImage(e.target.value)}/>
</label>
<input type="submit" value="Submit"/>
                </form>

            </div>
        </div>
    )
}

export default Upload;
