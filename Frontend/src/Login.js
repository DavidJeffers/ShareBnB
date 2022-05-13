import React, { useState } from "react";

function Login({ handleLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState(null);

  /** submits form data calls parent function */
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await handleLogin(formData);
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
          <label className="label" forhtml="username">
            Username
          </label>
          <input
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="row form-floating mb-3">
          <label className="label" forhtml="password">
            Password
          </label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-secondary">Sign In</button>
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

export default Login;
