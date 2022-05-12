import { NavLink } from "react-router-dom";

function NavBar({ handleLogout, currUser }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <span className="m-2">
          <NavLink to="/">ShareBnB</NavLink>
        </span>
        <div>
          {currUser ? (
            <div>
              <span className="m-2">
                <NavLink to="/listingpage">Listings</NavLink>
              </span>
              <span className="m-2">
                <NavLink to="/messages">Jobs</NavLink>
              </span>
              {/* <span className="m-2">
                <NavLink to="/profile">Profile</NavLink>
              </span> */}
              <span className="m-2">
                <NavLink to="/" onClick={handleLogout}>
                  Log out {currUser}{" "}
                </NavLink>
              </span>
            </div>
          ) : (
            <div>
              <span className="m-2">
                <NavLink to="/login">Login</NavLink>
              </span>
              <span className="m-2">
                <NavLink to="/signup">Sign Up</NavLink>
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
