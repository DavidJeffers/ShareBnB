import React, { useState } from "react";
import ShareBnBApi from "./api";
import { useNavigate } from "react-router-dom";

function ListingForm({ currUser }) {
  const [formData, setFormData] = useState({
    title: "",
    size: "",
    price: "",
    details: "",
    location: "",
    user_id: currUser,
  });

  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  /** submits form data calls parent function */
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await ShareBnBApi.addListing(formData);
      setMessage(null);
      navigate("/listingpage");
    } catch (err) {
      console.log(err);
      //   setMessage(err);
    }
  }

  //catch error...

  /** update fromData state on change */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((data) => ({ ...data, [name]: value }));
  }
  return (
    <div>
      <form className="formDisplay" onSubmit={handleSubmit}>
        <label className="label" forhtml="title">
          Title
        </label>
        <input
          className="input"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <label className="label" forhtml="size">
          Size
        </label>
        <input
          className="input"
          name="size"
          value={formData.size}
          onChange={handleChange}
        />
        <label className="label" forhtml="details">
          Details
        </label>
        <input
          className="input"
          name="details"
          value={formData.details}
          onChange={handleChange}
        />
        <label className="label" forhtml="price">
          Price
        </label>
        <input
          className="input"
          type="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />

        <label className="label" forhtml="location">
          Location
        </label>
        <input
          className="input"
          type="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

        <button className="btn btn-secondary">Upload Listing</button>
      </form>

      {message && (
        <p
          className="alert alert-danger"
          style={{
            marginLeft: "700px",
            marginRight: "700px",
            marginTop: "15px",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default ListingForm;
