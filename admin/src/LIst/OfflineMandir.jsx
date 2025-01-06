import React, { useState } from "react";
import MandirList from "./MandirList";
import { userList } from "./UserList";

const offlineMandirs = userList.filter((mandir) => mandir.status === "Offline");

const OfflineMandir = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mandirList, setMandirList] = useState(offlineMandirs);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Search functionality
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Sort functionality
  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedList = [...mandirList].sort((a, b) =>
      newSortOrder === "asc" ? a.id - b.id : b.id - a.id
    );
    setMandirList(sortedList);
    setSortOrder(newSortOrder); // Update the sort order state
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
                # {sortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th>Name</th>
              <th>Location</th>]
            </tr>
          </thead>
          <tbody>
            {filteredMandirList.map((mandir) => (
              <tr key={mandir.id}>
                <td className="fw-bold">{mandir.id}</td>
                <td>{mandir.name}</td>
                <td>{mandir.location}</td>
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
export default OfflineMandir;
