import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal"; // Import the Modal component
import Event from "../CMS/Event";

const EventList = () => {
  const [events, setEvents] = useState([]); // Manage event list
  const [searchTerm, setSearchTerm] = useState(""); // Search functionality
  const [sortOrder, setSortOrder] = useState("asc"); // Sort toggle
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 10; // Number of items per page
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [currentModal, setCurrentModal] = useState(""); // To manage modal title

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/events"); // Fetch events from backend
        setEvents(response.data); // Set the event data into state
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Delete an event by ID
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Event?")) {
      try {
        await axios.delete(`http://localhost:3000/api/events/${id}`);
        setEvents(events.filter((event) => event.id !== id)); // Remove deleted event from state
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  // Sort events by ID
  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedList = [...events].sort((a, b) =>
      newSortOrder === "asc" ? a.id - b.id : b.id - a.id
    );
    setEvents(sortedList);
    setSortOrder(newSortOrder); // Update the sort order state
  };

  const formatDate = (date) => {
    const eventDate = new Date(date);
    const day = eventDate.getDate(); // Get the day of the month
    const month = eventDate.getMonth() + 1; // Get the month (0-based index, so we add 1)
    const year = eventDate.getFullYear(); // Get the full year

    // Return the formatted string as 'DD-MM-YYYY'
    return `${day}-${month}-${year}`;
  };

  // Filter events based on search term
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = filteredEvents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle page change
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddEvent = () => {
    setCurrentModal("Add Mandir");
    setShowModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Event List</h3>
        <div>
          <button
            className="btn btn-sm me-2"
            style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
            onClick={handleAddEvent}
          >
            <i className="bi bi-plus-circle"></i> Add Event
          </button>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                ID {sortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th>Event Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.map((event) => (
              <tr key={event.id}>
                <td className="fw-bold">{event.id}</td>
                <td>{event.title}</td>
                <td>{formatDate(event.date)}</td> {/* Format the date here */}
                <td>{event.location}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-sm"
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
          className="btn btn-sm"
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
      <div className="mt-3  ">
        <span>
          Showing {currentEvents.length} of {filteredEvents.length} records
        </span>
      </div>
      <Modal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        currentModal={currentModal}
        renderModalContent={() => <Event />} // Pass the Mandir component to render inside the modal
      />
    </div>
  );
};

export default EventList;
