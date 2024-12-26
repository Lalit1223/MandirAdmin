import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import Home from "./Home";
import EventList from "./LIst/EventList";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/home" element={<Home />} />
      <Route path="/event" element={<EventList />} />
    </Routes>
  );
};

export default App;
