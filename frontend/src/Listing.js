import "./Listing.css"



const Listing = (props) => {
    const header = props.header;
    const description = props.description;
    const image = props.image;    

    return (
        <div className="list-container">
            <img className="listing-image" src={image}></img>
            <div className="listing">
                <h2 className="listing-header">{header}</h2>
                <p className="listing-description">{description}</p>
            </div>
        </div>
    )
}

export default Listing;


