import React from "react";
import { useEffect, useState } from "react";
import ShareBnBApi from "./api";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import ListingCard from "./ListingCard";

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [photos, setPhotos] = useState([]);

  useEffect(
    function fetchListingsOnRender() {
      async function getListings(searchTerm) {
        try {
          const resp = await ShareBnBApi.getListings();
          // console.log("response======", resp.listings);
          // let listings = resp.listings.filter((listing) =>
          //   listing.title.includes(searchTerm)
          // );
          setListings(resp.listings);
          setPhotos(resp.photos);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
      getListings();
    },
    [searchTerm]
  );
  console.log("photos========", photos);

  /**  update setStateTerm state */
  function changeSearchTerm(term) {
    setSearchTerm(term);
  }

  if (isLoading) return <i>Loading...</i>;

  return (
    <div>
      {/* <SearchBar changeSearchTerm={changeSearchTerm} /> */}
      <div>
        <ul className="ul-listingPage">
          {listings.map((listing) => (
            <li key={listing.id} className="card-listingPage">
              <Link to={`/ListingDetail/${listing.id}`}>
                <ListingCard listing={listing} photos={photos} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ListingsPage;
