import React, { useEffect, useState } from "react";
import axios from "axios";

const MandirList = () => {
  const [mandirs, setMandirs] = useState([]);
  const [error, setError] = useState("");

  // Fetch mandirs from the API
  useEffect(() => {
    const fetchMandirs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/mandir");
        setMandirs(response.data);
      } catch (err) {
        setError("Failed to fetch mandir list.");
        console.error(err);
      }
    };

    fetchMandirs();
  }, []);

  // Handle actions
  const handleActivate = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/mandir/${id}/activate`);
      setMandirs((prev) =>
        prev.map((mandir) =>
          mandir.id === id ? { ...mandir, status: 1 } : mandir
        )
      );
      alert("Mandir activated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to activate Mandir.");
    }
  };

  const handleEdit = (id) => {
    // Redirect or show edit form
    alert(`Edit Mandir with ID: ${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Mandir?")) {
      try {
        await axios.delete(`http://localhost:3000/api/mandir/${id}`);
        setMandirs((prev) => prev.filter((mandir) => mandir.id !== id));
        alert("Mandir deleted successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to delete Mandir.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Mandir List</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Nickname</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mandirs.length > 0 ? (
            mandirs.map((mandir, index) => (
              <tr key={mandir.id}>
                <td>{index + 1}</td>
                <td>{mandir.title}</td>
                <td>{mandir.nickname}</td>
                <td>{mandir.description}</td>
                <td>
                  <span
                    className={`badge ${
                      mandir.status === 1 ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {mandir.status === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    disabled={mandir.status === 1}
                    onClick={() => handleActivate(mandir.id)}
                  >
                    Activate
                  </button>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEdit(mandir.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(mandir.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No mandirs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MandirList;
