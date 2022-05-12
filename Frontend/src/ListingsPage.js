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

  useEffect(
    function fetchListingsOnRender() {
      async function getListings(searchTerm) {
        try {
          const resp = await ShareBnBApi.getListings();
          // console.log("response======", resp.listings);
          let listings = resp.listings.filter((listing) =>
            listing.title.includes(searchTerm)
          );
          setListings(listings);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
      getListings();
    },
    [searchTerm]
  );

  /**  update setStateTerm state */
  function changeSearchTerm(term) {
    setSearchTerm(term);
  }

  if (isLoading) return <i>Loading...</i>;

  return (
    <div>
      {/* <SearchBar changeSearchTerm={changeSearchTerm} /> */}
      <div>
        <ul>
          {listings.map((listing) => (
            <li key={listing.id} className="">
              <Link to={`/listings/${listing.id}`}>
                <ListingCard listing={listing} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ListingsPage;
