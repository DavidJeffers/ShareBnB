import React from "react";
import { Link } from "react-router-dom";

function Homepage({ currUser }) {
  return (
    <div className="home container text-center">
      <div className="title-homepage">
        <h1 className="">ShareBnB</h1>
        <h4 className="">Sharebnb: Outdoor rentals and more.</h4>
        {currUser ? (
          <div className="">Welcome back, {currUser}</div>
        ) : (
          <div className="">
            <Link to="/login">
              <button className="btn btn-home m-2">Log In</button>
            </Link>
            <Link to="/register">
              <button className="btn btn-home m-2">Register</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
