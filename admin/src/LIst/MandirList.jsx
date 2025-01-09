import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal"; // Import the Modal component
import Mandir from "../CMS/Mandir";
import MandirForm from "./MandirForm"; // A new component for the Mandir form

const MandirList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mandirList, setMandirList] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState(""); // To manage modal title
  const [mandirToEdit, setMandirToEdit] = useState(null); // State to store the Mandir to be edited

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/mandir")
      .then((response) => {
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

  const handleAddMandir = () => {
    setCurrentModal("Add Mandir");
    setMandirToEdit(null); // Clear any existing edit data
    setShowModal(true); // Open the modal
  };

  const handleEditMandir = (id) => {
    setCurrentModal("Edit Mandir");
    axios
      .get(`http://localhost:3000/api/mandir/${id}`)
      .then((response) => {
        setMandirToEdit(response.data); // Set the Mandir data for editing
        setShowModal(true); // Open the modal
      })
      .catch((error) =>
        console.error("Error fetching mandir data for edit:", error)
      );
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleSubmitForm = (formData) => {
    const apiCall = mandirToEdit
      ? axios.put(
          `http://localhost:3000/api/mandir/${mandirToEdit.id}`,
          formData
        ) // Update existing Mandir
      : axios.post("http://localhost:3000/api/mandir", formData); // Add new Mandir

    apiCall
      .then(() => {
        setShowModal(false); // Close the modal
        setMandirToEdit(null); // Clear the edit state
        // Optionally, you can re-fetch the mandir list to reflect the changes
        axios.get("http://localhost:3000/api/mandir").then((response) => {
          setMandirList(response.data);
        });
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        alert("Failed to submit data.");
      });
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Mandir?")) {
      try {
        await axios.delete(`http://localhost:3000/api/mandir/${id}`);
        setMandirList(mandirList.filter((mandir) => mandir.id !== id));
        alert("Mandir deleted successfully!");
      } catch (error) {
        console.error("Error deleting Mandir:", error);
        alert("Failed to delete the Mandir. Please try again.");
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      await axios.patch(`http://localhost:3000/api/mandir/${id}/status`, {
        status: newStatus,
      });

      setMandirList((prevList) =>
        prevList.map((mandir) =>
          mandir.id === id ? { ...mandir, status: newStatus } : mandir
        )
      );
      alert("Status updated successfully");
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

      {/* Mandir List Table */}
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
                      onChange={() => toggleStatus(mandir.id, mandir.status)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>

                <td>
                  <button
                    className="btn btn-warning btn-sm m-2"
                    onClick={() => handleEditMandir(mandir.id)} // Open the edit modal
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

      {/* Pagination */}
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
      <div className="mt-3">
        <span>
          Showing {filteredMandirList.length} of {mandirList.length} records
        </span>
      </div>

      {/* Modal for Add/Edit Mandir */}
      <Modal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        currentModal={currentModal}
        renderModalContent={() => (
          <MandirForm
            mandirData={mandirToEdit} // Pass the mandir data to the form if editing
            onSubmit={handleSubmitForm} // Handle form submission
          />
        )}
      />
    </div>
  );
};

export default MandirList;
