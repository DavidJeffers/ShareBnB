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
    <div className="container form-listingForm">
      <form className="formDisplay" onSubmit={handleSubmit}>
        <div className="row mb-3 form-floating">
          <label forhtml="title">Title</label>
          <input
            className="form-control"
            id="floatingTitle"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
          />
        </div>

        <div className="row mb-3 form-floating">
          <label forhtml="size">Size</label>
          <input
            className="form-control"
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="small, medium, large"
          />
        </div>

        <div className="row mb-3 form-floating">
          <label forhtml="details">Details</label>
          <input
            className="form-control"
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="This is my very nice outdoor space available for rent!"
          />
        </div>

        <div className="row mb-3 form-floating">
          <label forhtml="price">Price</label>
          <input
            className="form-control"
            type="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="(Per night price)"
          />
        </div>

        <div className="row mb-3 form-floating">
          <label forhtml="location">Location</label>
          <input
            className="input form-control"
            type="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="USA"
          />
        </div>

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
