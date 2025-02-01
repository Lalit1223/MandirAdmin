import React, { useState, useEffect } from "react";
import axios from "axios";

const OfflineMandir = () => {
  const [mandirList, setMandirList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOfflineMandirs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/mandir`);
      console.log("Mandir response:", response.data);

      if (!response.data.error) {
        const mandirs = response.data.mandirs || response.data;
        const offlineMandirs = mandirs.filter((mandir) => mandir.status === 0);
        setMandirList(Array.isArray(offlineMandirs) ? offlineMandirs : []);
      } else {
        console.error("Error from server:", response.data.message);
        setMandirList([]);
      }
    } catch (error) {
      console.error("Error fetching offline mandirs:", error);
      setMandirList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Offline Mandir List</h3>
        <div className="input-group" style={{ maxWidth: "300px" }}>
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

      {loading ? (
        <div className="text-center my-4">
          <div
            className="spinner-border"
            style={{ color: "#ff5722" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : mandirList.length === 0 ? (
        <div className="text-center my-4">
          <i
            className="bi bi-building text-muted"
            style={{ fontSize: "2rem" }}
          ></i>
          <p className="text-muted mt-2">No offline mandirs available</p>
        </div>
      ) : (
        <>
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
                  <th>Directions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((mandir) => (
                  <tr key={mandir.id}>
                    <td className="fw-bold">{mandir.id}</td>
                    <td>{mandir.title}</td>
                    <td>{mandir.city || "No location"}</td>
                    <td>
                      {mandir.map_link ? (
                        <a
                          href={mandir.map_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          <i className="bi bi-geo-alt me-1"></i>
                          View Map
                        </a>
                      ) : (
                        <span className="text-muted">No map link</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mandirList.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  className="btn btn-sm"
                  style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
              <div className="mt-3">
                <span>
                  Showing {currentItems.length} of {filteredMandirList.length}{" "}
                  records
                </span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OfflineMandir;
