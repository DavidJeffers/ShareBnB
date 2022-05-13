import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShareBnBApi from "./api";
import axios from "axios";
import SimpleImageSlider from "react-simple-image-slider";
import "./App.css";

function ListingDetail({ currUser }) {
  const { listing_id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileFormOpen, setFileFormOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [upload, setUpload] = useState(false);
  const [booked, setBooked] = useState(null);
  const [photoUrls, setPhotoUrls] = useState([]);

  useEffect(
    function getListing() {
      async function getListingAxios() {
        const listing = await ShareBnBApi.getListing(listing_id);
        console.log(listing);
        setListing(listing);
        setLoading(false);
        setUpload(false);
        setBooked(listing.listing.renter);
        setPhotoUrls(listing.photos.map((photo) => photo.photo_url));
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
    window.location.reload(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="">
      <div className="carousel">
        <SimpleImageSlider
          className="imageSlider"
          width={896}
          height={504}
          images={photoUrls}
          showBullets={true}
          showNavs={true}
        />
      </div>
      {fileFormOpen && (
        <div>
          <input type="file" onChange={setFileState} />
          <button onClick={fileUpload}>Upload</button>
        </div>
      )}
      {!fileFormOpen && currUser === listing.listing_user && (
        <div className="uploadImages-listingDetail">
          <button onClick={() => setFileFormOpen(true)}>Upload images</button>
        </div>
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
