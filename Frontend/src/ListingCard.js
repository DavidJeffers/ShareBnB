function ListingCard({ listing, photos }) {
  let photos_for_listings = null;
  if (photos) {
    photos_for_listings = photos.filter(
      (photo) => photo.listing_id === listing.id
    );
  }

  console.log("photos_for_listings", photos);
  console.log("listings", listing);
  return (
    <div className="">
      <p className="d-flex justify-content-between container">
        {listing.name}{" "}
        {photos_for_listings && (
          <img
            src={`${photos_for_listings[0].photo_url}`}
            alt={`${listing.title}'s logo.`}
            className="company-logo"
          ></img>
        )}
      </p>
      <p className="container">{listing.details}</p>
    </div>
  );
}

export default ListingCard;
