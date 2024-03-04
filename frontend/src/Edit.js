
import {useState, useEffect} from 'react';

import SERVER from './constants';
import Card from './Card';
import Listing from './Listing';

import {useSearchParams, useNavigate, useLocation} from 'react-router-dom';

const Edit = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    // retrieve information about entry number 
    const navigate = useNavigate();
    const eid = searchParams.get("eid");

    const [original, setOriginal] = useState([eid, "", "", ""]);
    
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [image, setImage] = useState("");
    
    // retrieve original information
    useEffect(() => {
        // collect original information from backend
        fetch(SERVER + `/get_entry?eid=${eid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (res) => {
            // store original information
            const result = await res.json();
            setOriginal(result[0]);
            console.log("ORIGINAL:", result[0]);
        }).catch((error) => {
            console.log("ERROR:", error);
        });
    }, []);

    // form information

    const submitData = async (event) => {
        // check if editdata has changed
        event.preventDefault();

        // check if valid data
        if(name === '' || desc === '') {
            alert("Invalid data");
            return;
        }

        if(image === '') {
            // if image is empty, then we can assume same image url (just leave emtpy string - backend will handle it);
            // send data -- NO IMAGE CHANGE
            fetch(SERVER + "/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([eid, name, desc, ""])
            }).then(async (res) => {
                console.log("RESULT:", res);
            }).then(() => {
                    navigate('/');
            }).catch((error) => {
                alert('There was an error: Please try again with valid data.');
            });
        }
        // if image changes
        else {
            // send data -- IMAGE CHANGE
            fetch(SERVER + "/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([eid, name, desc, image])
            }).then(async (res) => {
                const result = await res.json();
                const file = document.getElementById("imageInput").files[0];

                console.log("RESULT:", result);
                console.log("FILE:", file);

                // upload to aws bucket
                fetch(result.endpoint, {
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
                });
            }).catch((error) => {
                alert('There was an error: Please try again with valid data.');
            });
        }
    };
    
    // render the original information
    return (
        <>
            <div>
                {/* {eid} */}
                {/* render the original information */}
                <Card>
                    <Listing 
                        id={original._id}
                        header={original._title}
                        description={original._desc}
                        image={original._image}
                    />
                </Card>

            </div>
            {/* add in editing block */}
            <div>
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
    <input type="file" name="image" id="imageInput" accept="image/*" onChange={(e) => setImage(e.target.files[0])}/>
</label>
<input type="submit" value="Submit"/>
                </form>
            </div>
        </>
    )
}


export default Edit;
