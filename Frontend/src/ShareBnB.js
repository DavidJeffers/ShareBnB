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
            const username = jwt_decode(token);
            setCurrUser(username.sub);
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

  async function handleRegister(formData) {
    let resp = await ShareBnBApi.register(formData);
    console.log(resp.access_token);
    setCurrUser(resp.username);
    setToken(resp.access_token);
    localStorage.setItem("Token", resp.access_token);
  }

  function handleLogout() {
    localStorage.removeItem("Token");
    setToken(null);
    setCurrUser(null);
  }

  return (
    <div>
      <BrowserRouter>
        <NavBar handleLogout={handleLogout} currUser={currUser} />
        <RouteList
          token={token}
          currUser={currUser}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
        />
      </BrowserRouter>
    </div>
  );
}

export default ShareBnB;
