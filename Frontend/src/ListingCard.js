import React, { useEffect, useState } from "react";

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
    <div className="">
      {photos_for_listings && (
        <img
          style={{ maxWidth: "30vw", maxHeight: "200px" }}
          src={`${photos_for_listings[0].photo_url}`}
          alt={`${listing.title}'s logo.`}
          className="company-logo"
        ></img>
      )}
      <p className="">{listing.title} </p>
      <p className="d-flex justify-content-between container">
        Size: {listing.size}{" "}
      </p>
      <p className="d-flex justify-content-between container">
        Price: ${listing.price} Per day
      </p>

      <p className="container">Description: {listing.details}</p>
    </div>
  );
}

export default ListingCard;
