import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import Session from "./pages/Session";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/signup" element={<Signup />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/welcome" element={<Welcome />} />
                <Route exact path="/session/:id" element={<Session />} />
            </Routes>
        </Router>
    );
}
