import React, { useState, useEffect } from "react";
import axios from "axios";

const OfflineMandir = () => {
  const [mandirList, setMandirList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch only offline mandirs (status = 0)
    const fetchOfflineMandirs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/mandir`);
        const offlineMandirs = response.data.filter(
          (mandir) => mandir.status === 0
        );
        setMandirList(offlineMandirs);
      } catch (error) {
        console.error("Error fetching offline mandirs:", error);
      }
    };

    fetchOfflineMandirs();
  }, []);

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
    setSortOrder(newSortOrder);
  };

  // Filter mandirs based on search term
  const filteredMandirList = mandirList.filter(
    (mandir) =>
      (mandir.title &&
        mandir.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mandir.map_link &&
        mandir.map_link.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMandirList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMandirList.length / itemsPerPage);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="text-primary">Offline Mandir List</h3>
        <div>
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

      {/* Table for displaying mandirs */}
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
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((mandir) => (
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No Offline Mandirs Found
                </td>
              </tr>
            )}
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

      {/* Showing records info */}
      <div className="mt-3">
        <span>
          Showing {currentItems.length} of {filteredMandirList.length} records
        </span>
      </div>
    </div>
  );
};

export default OfflineMandir;
