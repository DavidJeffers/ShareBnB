import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./Homepage";
import Register from "./Register";
import Login from "./Login";
import MessageList from "./MessageList";
import ListingDetail from "./ListingDetail";
import ListingsPage from "./ListingsPage";

function RouteList({ token, currUser, handleLogin, handleRegister }) {
  return (
    <div>
      <Routes>
        {token && (
          <>
            <Route
              path="/ListingDetail/:listing_id"
              element={<ListingDetail />}
            />
            <Route path="/ListingPage" element={<ListingsPage />} />
            <Route path="/Messages" element={<MessageList />} />
          </>
        )}
        {!token && (
          <>
            <Route
              path="/Login"
              element={<Login handleLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={<Register handleRegister={handleRegister} />}
            />
          </>
        )}
        <Route path="/" element={<Homepage currUser={currUser} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default RouteList;
