import React, {useState} from "react";


function Register({handleRegister}) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    bio: "",
    location: ""
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
    <div>
      <form className="formDisplay" onSubmit={handleSubmit}>
        <label className="label" forhtml="username">
          Username
        </label>
        <input
          className="input"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <label className="label" forhtml="password">
          Password
        </label>
        <input
          className="input"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <label className="label" forhtml="first_name">
          First Name
        </label>
        <input
          className="input"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
        <label className="label" forhtml="last_name">
          Last Name
        </label>
        <input
          className="input"
          type="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
        <label className="label" forhtml="bio">
          Bio
        </label>
        <input
          className="input"
          type="bio"
          name="bio"
          value={formData.bio}
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
