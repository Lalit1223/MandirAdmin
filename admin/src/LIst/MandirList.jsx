import React, { useState, useEffect } from "react";
import axios from "axios";

const MandirList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mandirList, setMandirList] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/mandir")
      .then((response) => {
        console.log("API Response:", response.data);
        setMandirList(response.data);
      })
      .catch((error) => console.error("Error fetching mandir data:", error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedList = [...mandirList].sort((a, b) =>
      newSortOrder === "asc" ? a.id - b.id : b.id - a.id
    );
    setMandirList(sortedList);
    setSortOrder(newSortOrder);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Mandir?")) {
      try {
        await axios.delete(`http://localhost:3000/api/mandir/${id}`);
        // Remove the deleted item from the state
        setMandirList(mandirList.filter((mandir) => mandir.id !== id));
        alert("Mandir deleted successfully!");
      } catch (error) {
        console.error("Error deleting Mandir:", error);
        alert("Failed to delete the Mandir. Please try again.");
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mandirList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(mandirList.length / itemsPerPage);

  const filteredMandirList = currentItems.filter(
    (mandir) =>
      mandir.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mandir.map_link?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Filtered Mandir List:", filteredMandirList);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="text-primary">Mandir List</h3>
        <div>
          <button
            className="btn btn-sm me-2"
            style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
            onClick={() => alert("Redirect to Add Mandir Modal")}
          >
            <i className="bi bi-plus-circle"></i> Add Mandir
          </button>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search Mandir..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover shadow-sm rounded">
          <thead
            className="text-white"
            style={{
              background: "linear-gradient(135deg, #ff5722, #ecba80)",
            }}
          >
            <tr>
              <th onClick={handleSort} style={{ cursor: "pointer" }}>
                # {sortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMandirList.map((mandir) => (
              <tr key={mandir.id}>
                <td className="fw-bold">{mandir.id}</td>
                <td>{mandir.title}</td>
                <td>
                  <a
                    href={mandir.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Map
                  </a>
                </td>
                {/* mandir status */}
                <td>
                  <span
                    className={`badge ${
                      mandir.status === "Live" ? "bg-success" : "bg-secondary"
                    }`}
                    style={{
                      padding: "0.5rem 1rem",
                      fontSize: "0.9rem",
                      borderRadius: "10px",
                    }}
                  >
                    {mandir.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      alert(`Edit functionality for Mandir ID: ${mandir.id}`)
                    }
                  >
                    <i className="bi bi-pencil-square"></i> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(mandir.id)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-sm"
          style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-sm"
          style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MandirList;
