import "./Listing.css"

import { useNavigate } from "react-router-dom";

const Listing = (props) => {

    const id = props.id;
    const header = props.header;
    const description = props.description;
    const image = props.image;

    const navigate = useNavigate();

    // redirect to editing page when editing
    const editPageRedirect = (event) => {
        console.log("EVENT:", event, "LID:", id);
        // redirect to editing page with query params
        navigate({
            pathname: "/edit",
            search: `?eid=${id}&`
        });
    }

    return (
        <div className="list-container">
            <div className="list-image-container">
                {/* image */}
                <div>
                    <a className="edit" onClick={editPageRedirect}>
                        <img src="/edit.png" width="15px"></img>
                    </a>
                </div>
                <img className="listing-image" src={image}></img>
            </div>
            <div className="listing">
                <h2 className="listing-header">{header}</h2>
                <p className="listing-description">{description}</p>
                {/* edit */}
            </div>
        </div>
    )
}

export default Listing;


