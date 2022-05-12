function ListingCard({ listing }) {
  return (
    <div className="">
      <p className="d-flex justify-content-between container">
        {listing.name}{" "}
        <img
          src={`${listing}`}
          alt={`${company.name}'s logo.`}
          className="company-logo"
        ></img>
      </p>
      <p className="container">{company.description}</p>
    </div>
  );
}
