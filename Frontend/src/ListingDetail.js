import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShareBnBApi from "./api";
import axios from "axios";

function ListingDetail({ currUser }) {
  const { listing_id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileFormOpen, setFileFormOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [upload, setUpload] = useState(false);
  const [booked, setBooked] = useState(null);

  useEffect(
    function getListing() {
      async function getListingAxios() {
        const listing = await ShareBnBApi.getListing(listing_id);
        console.log(listing);
        setListing(listing);
        setLoading(false);
        setUpload(false);
        setBooked(listing.listing.renter);
      }
      getListingAxios();
    },
    [listing_id, upload]
  );

  function setFileState(evt) {
    setFile(evt.target.files[0]);
  }

  async function toggleRent() {
    if (!booked) {
      try {
        await ShareBnBApi.rentListing({ username: currUser }, listing_id);
        setUpload(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await ShareBnBApi.cancelListing({ username: currUser }, listing_id);
        setUpload(true);
      } catch (err) {
        console.log(err);
      }
    }
  }
  async function fileUpload() {
    const formData = new FormData();

    formData.append("file", file);
    try {
      await axios({
        method: "post",
        url: `http://127.0.0.1:5001/listings/${listing_id}/upload`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      console.log(err);
    }
    setFileFormOpen(false);
    setUpload(true);
  }
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {listing.photos.length > 0 &&
        listing.photos.map((photo) => (
          <img
            key={photo.photo_url}
            src={photo.photo_url}
            style={{ maxWidth: "30vw", maxHeight: "200px" }}
            alt={listing.listing.title}
          />
        ))}
      {fileFormOpen && (
        <>
          <input type="file" onChange={setFileState} />
          <button onClick={fileUpload}>Upload</button>
        </>
      )}
      {!fileFormOpen && currUser === listing.listing_user && (
        <button onClick={() => setFileFormOpen(true)}>Upload images</button>
      )}

      <h1>{listing.listing.title}</h1>
      <h3>Size: {listing.listing.size}</h3>
      <h3>Price: {listing.listing.price}</h3>
      <p> {listing.listing.details}</p>
      {booked ? <p>Listing is booked</p> : <p>Listing is open</p>}
      {listing.listing_user !== currUser && !booked && (
        <button onClick={toggleRent}>Reserve</button>
      )}
      {listing.listing_user !== currUser &&
        booked &&
        listing.listing.renter === currUser && (
          <button onClick={toggleRent}>Cancel</button>
        )}
    </div>
  );
}

export default ListingDetail;
