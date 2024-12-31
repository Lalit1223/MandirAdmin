import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import Home from "./Home";
import EventList from "./LIst/EventList";
import ProtectedRoute from "./ProtectedRoute";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/event" element={<EventList />} />
    </Routes>
  );
};

export default App;
