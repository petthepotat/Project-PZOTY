import logo from './logo.svg';
import './App.css';

import Listing from './Listing';
import Card from './Card';

import {useEffect, useState} from 'react';
import SERVER from './constants';



function App() {
  document.title = "School Listings Website";
  const [listings, setListings] = useState([]);

  // request listings from the backend
  useEffect(() =>  {
    fetch(SERVER + "/listings")
      .then((res) => res.json())
      .then((data) => {
        console.log("Request: ", data.listings);
        // load listings into the DOM
        if(data.listings !== undefined) {
          setListings(data["listings"]);
        }
        // console.log(data);
        // console.log(listings);
      }
      ).catch((error) => {
        console.log("Error: ", error);
      });
  }, []);

  // load listings into the DOM

  return (
    <div className="container">
      <header className="App-header">
        <h1>
          Welcome to the Listings Website
        </h1>
        <p>
          This is a simple website to display listings things
        </p>
        
        <div className="container">
          <div className="toolbar">
            <a href="/upload" className="upload-button">
              Create A New Listing
            </a>
          </div>
        </div>

      </header>

      {/* listings */}
          <div id="listings-container" className="listings">
            {
                listings.map((listing, index) => {
                  console.log(index);
                return (
                  <Card>
                    <Listing
                      id={listing.id}
                      header={listing.header}
                      description={listing.description}
                      image={listing.image}
                    />
                  </Card>
                )
              })
            }
          </div>
    </div>
  );
}

export default App;
