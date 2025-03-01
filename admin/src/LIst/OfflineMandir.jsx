import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OfflineMandir = () => {
  const navigate = useNavigate();
  const API_URL =
    import.meta.env.VITE_API_URL || "https://man-mandir.onrender.com";

  const [mandirList, setMandirList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  // Check authentication and fetch mandirs on component mount
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (!authToken || isAuth !== "true") {
      // Redirect to login if not authenticated
      navigate("/login");
    } else {
      fetchOfflineMandirs();
    }
  }, [navigate]);

  const fetchOfflineMandirs = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/mandir/admin/get`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        const mandirs = response.data.data || [];
        // Filter for offline mandirs (where status is false)
        const offlineMandirs = mandirs.filter((mandir) => !mandir.status);

        // Add index property to each mandir for numbering
        const indexedMandirs = offlineMandirs.map((mandir, index) => ({
          ...mandir,
          index: index + 1,
        }));

        setMandirList(indexedMandirs);
      } else {
        console.error("Error from server:", response.data.message);
        setMandirList([]);
      }
    } catch (error) {
      console.error("Error fetching offline mandirs:", error);
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      }
      setMandirList([]);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Sort functionality
  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedList = [...mandirList].sort((a, b) =>
      newSortOrder === "asc" ? a.index - b.index : b.index - a.index
    );
    setMandirList(sortedList);
    setSortOrder(newSortOrder);
  };

  // Filter mandirs based on search term
  const filteredMandirList = mandirList.filter(
    (mandir) =>
      (mandir.title &&
        mandir.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mandir.city &&
        mandir.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mandir.country &&
        mandir.country.toLowerCase().includes(searchTerm.toLowerCase()))
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
                  <th>Nickname</th>
                  <th>Location</th>
                  <th>Directions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((mandir) => (
                  <tr key={mandir._id}>
                    <td className="fw-bold">{mandir.index}</td>
                    <td>{mandir.title}</td>
                    <td>{mandir.nick_name || "-"}</td>
                    <td>
                      {mandir.city}, {mandir.country}
                    </td>
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

          {filteredMandirList.length > 0 && (
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
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  className="btn btn-sm"
                  style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
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
