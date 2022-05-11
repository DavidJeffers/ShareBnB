import "./App.css";
import NavBar from "./NavBar";
import RouteList from "./RouteList";
import { useState, useEffect } from "react";
import Navigation from "./Navigation";

function ShareBnB() {
  const [token, setToken] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      <NavBar />
      <RouteList />
    </div>
  );
}

export default ShareBnB;
