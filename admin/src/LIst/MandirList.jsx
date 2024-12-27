import React, { useState } from "react";

export const mandirListData = [
  { id: 1, name: "Shri Ram Mandir", location: "Ayodhya", status: "Live" },
  {
    id: 2,
    name: "Kashi Vishwanath Temple",
    location: "Varanasi",
    status: "Live",
  },
  { id: 3, name: "Jagannath Temple", location: "Puri", status: "Offline" },
  {
    id: 4,
    name: "Vaishno Devi Temple",
    location: "Jammu & Kashmir",
    status: "Live",
  },
  { id: 5, name: "Meenakshi Temple", location: "Madurai", status: "Offline" },
  { id: 6, name: "Somnath Temple", location: "Gujarat", status: "Live" },
  {
    id: 7,
    name: "Tirupati Balaji Temple",
    location: "Tirupati",
    status: "Offline",
  },
];

const MandirList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mandirList, setMandirList] = useState(mandirListData);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Search functionality
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Sort functionality
  const handleSort = () => {
    const sortedList = [...mandirList].sort((a, b) =>
      sortOrder === "asc" ? a.id - b.id : b.id - a.id
    );
    setMandirList(sortedList);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Delete functionality
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this mandir?")) {
      const updatedList = mandirList.filter((mandir) => mandir.id !== id);
      setMandirList(updatedList);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mandirList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(mandirList.length / itemsPerPage);

  const filteredMandirList = currentItems.filter(
    (mandir) =>
      mandir.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mandir.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="text-primary">Mandir List</h3>
        <div>
          <button
            className="btn btn-sm me-2"
            style={{
              backgroundColor: "#ff5722", // Primary theme color
              color: "#ffffff", // White text for contrast
            }}
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
                #{" "}
                <i
                  className={`bi ${
                    sortOrder === "asc" ? "bi-arrow-up" : "bi-arrow-down"
                  }`}
                ></i>
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
                <td>{mandir.name}</td>
                <td>{mandir.location}</td>
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
      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn  btn-sm"
          style={{
            backgroundColor: "#ff5722", // Primary theme color
            color: "#ffffff", // White text for contrast
          }}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn  btn-sm"
          style={{
            backgroundColor: "#ff5722", // Primary theme color
            color: "#ffffff", // White text for contrast
          }}
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
