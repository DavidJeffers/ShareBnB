import "./App.css";
import NavBar from "./NavBar";
import RouteList from "./RouteList";
import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";
import ShareBnBApi from "./api";

function ShareBnB() {
  const [token, setToken] = useState(localStorage.getItem("Token"));
  const [currUser, setCurrUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    function decodeToken() {
      async function getUser() {
        if (token) {
          try {
            ShareBnBApi.token = token;
            setIsLoading(false);
          } catch (err) {
            setIsLoading(false);
            setCurrUser(null);
            console.log(err);
          }
        } else {
          setIsLoading(false);
        }
      }
      getUser();
    },
    [token]
  );

  async function handleLogin(formData) {
    let resp = await ShareBnBApi.login(formData);
    console.log(resp.access_token);
    setCurrUser(resp.username);
    setToken(resp.access_token);
    localStorage.setItem("Token", resp.access_token);
  }
  return (
    <div>
      {/* <NavBar /> */}
      <BrowserRouter>
        <RouteList token={token} handleLogin={handleLogin} />
      </BrowserRouter>
    </div>
  );
}

export default ShareBnB;
