import React, { useState } from "react";
import { Link } from "react-router-dom";
import SimpleImageSlider from "react-simple-image-slider";

function Homepage({ currUser }) {
  const [photos, setPhotos] = useState([
    "https://sharebnb-photos-r25.s3.us-west-1.amazonaws.com/1.jpeg",
    "https://sharebnb-photos-r25.s3.us-west-1.amazonaws.com/2.jpeg",
    "https://sharebnb-photos-r25.s3.us-west-1.amazonaws.com/3.jpeg",
  ]);
  // const pictures = [{ url: "1.jpeg" }, { url: "2.jpeg" }, { url: "3.jpeg" }];

  return (
    <div className="home container text-center">
      <div className="title-homepage">
        <h1 className="">ShareBnB</h1>
        <h4 className="">Sharebnb: Outdoor rentals and more.</h4>
        {currUser ? (
          <div className="">Welcome back, {currUser}</div>
        ) : (
          <div className="">
            <Link
              style={{ marginRight: "10px" }}
              className="btn btn-primary"
              to="/login"
            >
              Login
            </Link>
            <Link
              style={{ marginLeft: "10px" }}
              className="btn btn-primary"
              to="/register"
            >
              Register{" "}
            </Link>
          </div>
        )}
      </div>
      <div className="carousel">
        <SimpleImageSlider
          className="imageSlider"
          width={896}
          height={504}
          images={photos}
          showBullets={true}
          showNavs={true}
        />
      </div>
    </div>
  );
}

export default Homepage;
