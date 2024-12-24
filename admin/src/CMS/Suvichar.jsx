import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Suvichar = () => {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/suvichar", { text, author });

      alert("Suvichar added successfully!");
      console.log(response.data);

      // Reset form fields
      setText("");
      setAuthor("");

      navigate("/suvichar");
    } catch (error) {
      console.error("Error adding suvichar:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Suvichar</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="text" className="form-label">
            Suvichar
          </label>
          <textarea
            className="form-control"
            id="text"
            placeholder="Enter suvichar text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">
            Author
          </label>
          <input
            type="text"
            className="form-control"
            id="author"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Add Suvichar
        </button>
      </form>
    </div>
  );
};

export default Suvichar;
