import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import Event from "../CMS/Event";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/events`);
      console.log("Events response:", response.data);

      if (!response.data.error) {
        const eventData = response.data.events || response.data;
        setEvents(Array.isArray(eventData) ? eventData : []);
      } else {
        console.error("Error from server:", response.data.message);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Event?")) {
      try {
        const response = await axios.delete(`${API_URL}/api/events/${id}`);
        if (!response.data.error) {
          await fetchEvents(); // Refresh the list
          alert("Event deleted successfully!");
        } else {
          alert(response.data.message || "Failed to delete the event.");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete the event. Please try again.");
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
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm"
            style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
            onClick={handleAddEvent}
          >
            <i className="bi bi-plus-circle me-1"></i> Add Event
          </button>
          <div className="input-group" style={{ maxWidth: "300px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
      ) : events.length === 0 ? (
        <div className="text-center my-4">
          <i
            className="bi bi-calendar-x text-muted"
            style={{ fontSize: "2rem" }}
          ></i>
          <p className="text-muted mt-2">No events available</p>
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
                    <td>{formatDate(event.date)}</td>
                    <td>{event.location || "No location"}</td>
                    <td>
                      {/* should be added if required edit functionality */}
                      {/* <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditEvent(event.id)}
                      >
                        <i className="bi bi-pencil-square"></i> Edit
                      </button> */}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(event.id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {events.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  className="btn btn-sm"
                  style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
                  onClick={() => changePage(currentPage - 1)}
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
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
              <div className="mt-3">
                <span>
                  Showing {currentEvents.length} of {filteredEvents.length}{" "}
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
        renderModalContent={() => <Event onSubmitSuccess={fetchEvents} />}
      />
    </div>
  );
};

export default EventList;
