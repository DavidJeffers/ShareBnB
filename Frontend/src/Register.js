import React, { useState } from "react";

function Register({ handleRegister }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
  });
  const [message, setMessage] = useState(null);

  /** submits form data calls parent function */
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await handleRegister(formData);
      setMessage(null);
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
        <div className="row form-floating mb-3">
          <label forhtml="username">Username</label>
          <input
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="row form-floating mb-3">
          <label forhtml="password">Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="row form-floating mb-3">
          <label forhtml="first_name">First Name</label>
          <input
            className="form-control"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className="row form-floating mb-3">
          <label forhtml="last_name">Last Name</label>
          <input
            className="form-control"
            type="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="row form-floating mb-3">
          <label forhtml="bio">Bio</label>
          <input
            className="form-control"
            type="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        <div className="row form-floating mb-3">
          <label forhtml="location">Location</label>
          <input
            className="form-control"
            type="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-secondary">Register</button>
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

export default Register;
