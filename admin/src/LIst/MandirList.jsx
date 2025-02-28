import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import MandirForm from "./MandirForm";
import { useNavigate } from "react-router-dom";

const MandirList = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [searchTerm, setSearchTerm] = useState("");
  const [mandirList, setMandirList] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState("");
  const [mandirToEdit, setMandirToEdit] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (!authToken || isAuth !== "true") {
      // Redirect to login if not authenticated
      navigate("/login");
    } else {
      fetchMandirs();
    }
  }, [navigate]);

  const fetchMandirs = async () => {
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
        // Add index property to each mandir for numbering
        const mandirs = response.data.data.map((mandir, index) => ({
          ...mandir,
          index: index + 1,
        }));
        setMandirList(mandirs || []);
      } else {
        console.error("Error from server:", response.data.message);
        setMandirList([]);
      }
    } catch (error) {
      console.error("Error fetching mandir data:", error);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedList = [...mandirList].sort((a, b) => {
      return newSortOrder === "asc" ? a.index - b.index : b.index - a.index;
    });
    setMandirList(sortedList);
    setSortOrder(newSortOrder);
  };

  const handleAddMandir = () => {
    setCurrentModal("Add Mandir");
    setMandirToEdit(null); // Clear any existing edit data
    setShowModal(true); // Open the modal
  };

  const handleEditMandir = async (id) => {
    try {
      setLoading(true);
      setCurrentModal("Edit Mandir");
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        navigate("/login");
        return;
      }

      // Use the admin-specific endpoint to get mandir details
      const response = await axios.get(`${API_URL}/mandir/admin/get/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        setMandirToEdit(response.data.data);
        setShowModal(true);
      } else {
        console.error("Error from server:", response.data.message);
        alert("Failed to fetch mandir details.");
      }
    } catch (error) {
      console.error("Error fetching mandir data for edit:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      }
      alert("Failed to fetch mandir details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitComplete = () => {
    handleCloseModal();
    fetchMandirs(); // Refresh the list after submit
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Mandir?")) {
      try {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          navigate("/login");
          return;
        }

        const response = await axios.delete(`${API_URL}/mandir/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success) {
          fetchMandirs(); // Refresh list
          alert("Mandir deleted successfully!");
        } else {
          alert(response.data.message || "Failed to delete the Mandir.");
        }
      } catch (error) {
        console.error("Error deleting Mandir:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("isAuthenticated");
          navigate("/login");
        }
        alert("Failed to delete the Mandir. Please try again.");
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        navigate("/login");
        return;
      }

      const newStatus = !currentStatus;

      const response = await axios.patch(
        `${API_URL}/mandir/update-status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        setMandirList((prevList) =>
          prevList.map((mandir) =>
            mandir._id === id ? { ...mandir, status: newStatus } : mandir
          )
        );
        alert("Status updated successfully");
      } else {
        alert(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      }
      alert("Failed to update status");
    }
  };

  // Pagination logic
  const filteredMandirList = mandirList.filter(
    (mandir) =>
      mandir.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mandir.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mandir.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h3 className="text-primary">Mandir List</h3>
        <div className="d-flex">
          <button
            className="btn btn-sm me-2"
            style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
            onClick={handleAddMandir}
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
          <p className="text-muted mt-2">No mandirs available</p>
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
                  <th>Status</th>
                  <th>Actions</th>
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
                          Go to map
                        </a>
                      ) : (
                        <span className="text-muted">No map link</span>
                      )}
                    </td>
                    <td className="d-flex flex-column align-items-center">
                      <span
                        className={`badge ${
                          mandir.status ? "bg-success" : "bg-secondary"
                        }`}
                        style={{
                          fontSize: "0.9rem",
                          borderRadius: "10px",
                          marginBottom: "5px",
                        }}
                      >
                        {mandir.status ? "Live" : "Offline"}
                      </span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={mandir.status}
                          onChange={() =>
                            toggleStatus(mandir._id, mandir.status)
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm m-2"
                        onClick={() => handleEditMandir(mandir._id)}
                      >
                        <i className="bi bi-pencil-square"></i> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(mandir._id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
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
                  Page {currentPage} of {totalPages}
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

      <Modal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        currentModal={currentModal}
        renderModalContent={() => (
          <MandirForm
            mandirData={mandirToEdit}
            onSubmit={handleSubmitComplete}
            isEditing={!!mandirToEdit}
          />
        )}
      />
    </div>
  );
};

export default MandirList;
