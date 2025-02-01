import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import MandirForm from "./MandirForm";

const MandirList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mandirList, setMandirList] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState("");
  const [mandirToEdit, setMandirToEdit] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchMandirs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/mandir`);
      console.log("Fetch response:", response.data); // For debugging

      if (!response.data.error) {
        // Handle both response formats
        const mandirs = response.data.mandirs || response.data;
        setMandirList(Array.isArray(mandirs) ? mandirs : []);
      } else {
        console.error("Error from server:", response.data.message);
        setMandirList([]);
      }
    } catch (error) {
      console.error("Error fetching mandir data:", error);
      setMandirList([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMandirs();
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

  const handleAddMandir = () => {
    setCurrentModal("Add Mandir");
    setMandirToEdit(null); // Clear any existing edit data
    setShowModal(true); // Open the modal
  };

  const handleEditMandir = async (id) => {
    try {
      setCurrentModal("Edit Mandir");
      const response = await axios.get(`${API_URL}/api/mandir/${id}`);
      console.log("Edit response:", response.data); // For debugging

      if (!response.data.error) {
        // Check if mandir data exists in the response
        const mandirData = response.data.mandir || response.data;
        setMandirToEdit(mandirData);
        setShowModal(true);
      } else {
        console.error("Error from server:", response.data.message);
        alert("Failed to fetch mandir details.");
      }
    } catch (error) {
      console.error("Error fetching mandir data for edit:", error);
      alert("Failed to fetch mandir details.");
    }
  };
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };
  const handleSubmitForm = async (formData) => {
    try {
      const apiCall = mandirToEdit
        ? axios.put(`${API_URL}/api/mandir/${mandirToEdit.id}`, formData)
        : axios.post(`${API_URL}/api/mandir`, formData);

      const response = await apiCall;
      console.log("Submit response:", response.data); // For debugging

      if (!response.data.error) {
        setShowModal(false);
        setMandirToEdit(null);
        await fetchMandirs(); // Use await to ensure data is refreshed
        alert(
          mandirToEdit
            ? "Mandir updated successfully!"
            : "Mandir added successfully!"
        );
      } else {
        alert(response.data.message || "Operation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit data.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Mandir?")) {
      try {
        const response = await axios.delete(`${API_URL}/api/mandir/${id}`);
        if (!response.data.error) {
          fetchMandirs(); // Refresh list
          alert("Mandir deleted successfully!");
        } else {
          alert(response.data.message || "Failed to delete the Mandir.");
        }
      } catch (error) {
        console.error("Error deleting Mandir:", error);
        alert("Failed to delete the Mandir. Please try again.");
      }
    }
  };
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const response = await axios.patch(`${API_URL}/api/mandir/${id}/status`, {
        status: newStatus,
      });

      if (!response.data.error) {
        setMandirList((prevList) =>
          prevList.map((mandir) =>
            mandir.id === id ? { ...mandir, status: newStatus } : mandir
          )
        );
        alert("Status updated successfully");
      } else {
        alert(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
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
  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Mandir List</h3>
        <div>
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
                  <th>Location</th>
                  <th>Directions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMandirList.map((mandir) => (
                  <tr key={mandir.id}>
                    <td className="fw-bold">{mandir.id}</td>
                    <td>{mandir.title}</td>
                    <td>{mandir.city}</td>
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
                          mandir.status === 1 ? "bg-success" : "bg-secondary"
                        }`}
                        style={{
                          fontSize: "0.9rem",
                          borderRadius: "10px",
                          marginBottom: "5px",
                        }}
                      >
                        {mandir.status === 1 ? "Live" : "Offline"}
                      </span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={mandir.status === 1}
                          onChange={() =>
                            toggleStatus(mandir.id, mandir.status)
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm m-2"
                        onClick={() => handleEditMandir(mandir.id)}
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
                  Showing {filteredMandirList.length} of {mandirList.length}{" "}
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
            onSubmit={handleSubmitForm}
            isEditing={!!mandirToEdit}
          />
        )}
      />
    </div>
  );
};

export default MandirList;
