import React from "react";
import { useEffect, useState } from "react";
import ShareBnBApi from "./api";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import ListingCard from "./ListingCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [photos, setPhotos] = useState([]);

  useEffect(
    function fetchListingsOnRender() {
      async function getListings(searchTerm) {
        try {
          const resp = await ShareBnBApi.getListings();
          // console.log("response======", resp.listings);
          // let listings = resp.listings.filter((listing) =>
          //   listing.title.includes(searchTerm)
          // );
          setListings(resp.listings);
          setPhotos(resp.photos);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
      getListings();
    },
    [searchTerm]
  );
  console.log("photos========", photos);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  /**  update setStateTerm state */
  function changeSearchTerm(term) {
    setSearchTerm(term);
  }

  if (isLoading) return <i>Loading...</i>;

  return (
    <div>
      {/* <SearchBar changeSearchTerm={changeSearchTerm} /> */}
      <h1 style={{ marginTop: "30px" }}>Listings</h1>

      <div style={{ marginTop: "50px" }}>
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={true}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          keyBoardControl={true}
          // transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          shouldResetAutoplay={false}
        >
          {listings.map((listing) => (
            <div key={listing.id} className="">
              <Link to={`/ListingDetail/${listing.id}`}>
                <ListingCard listing={listing} photos={photos} />
              </Link>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default ListingsPage;
