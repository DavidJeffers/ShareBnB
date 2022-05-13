import React, { useEffect, useState } from "react";
import "./App.css";

function ListingCard({ listing, photos }) {
  const [photos_for_listings, set_photos_for_listings] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("photos=================", photos);
  useEffect(function setPhotos() {
    if (photos.filter((photo) => photo.listing_id === listing.id).length > 0) {
      set_photos_for_listings(
        photos.filter((photo) => photo.listing_id === listing.id)
      );
    } else {
      set_photos_for_listings(null);
    }
    setLoading(false);
  }, []);

  if (loading) return <div>loading...</div>;
  console.log("listings", photos_for_listings);

  return (
    <div className="card-listingcard">
      {photos_for_listings && (
        <img
          style={{ maxWidth: "30vw", maxHeight: "200px" }}
          src={`${photos_for_listings[0].photo_url}`}
          alt={`${listing.title}'s logo.`}
          className="sharebnb-image"
        ></img>
      )}
      <p className="">{listing.title} </p>
      <div className="card-text">
        <p className="">Size: {listing.size} </p>
        <p className="">${listing.price} per day</p>
      </div>
    </div>
  );
}

export default ListingCard;
