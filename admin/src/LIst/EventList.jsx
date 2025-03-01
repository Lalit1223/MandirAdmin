import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import Event from "../CMS/Event";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const navigate = useNavigate();
  const API_URL =
    import.meta.env.VITE_API_URL || "https://man-mandir.onrender.com";

  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (!authToken || isAuth !== "true") {
      // Redirect to login if not authenticated
      navigate("/login");
    } else {
      fetchEvents();
    }
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/event/admin/get`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        // Add index property to each event for numbering
        const eventData = response.data.data.map((event, index) => ({
          ...event,
          index: index + 1,
        }));
        setEvents(eventData || []);
      } else {
        console.error("Error from server:", response.data.message);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Event?")) {
      try {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          navigate("/login");
          return;
        }

        const response = await axios.delete(`${API_URL}/event/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success) {
          await fetchEvents(); // Refresh the list
          alert("Event deleted successfully!");
        } else {
          alert(response.data.message || "Failed to delete the event.");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("isAuthenticated");
          navigate("/login");
        }
        alert("Failed to delete the event. Please try again.");
      }
    }
  };

  // Sort events by index
  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedList = [...events].sort((a, b) =>
      newSortOrder === "asc" ? a.index - b.index : b.index - a.index
    );
    setEvents(sortedList);
    setSortOrder(newSortOrder);
  };

  const formatDate = (dateString) => {
    const eventDate = new Date(dateString);
    const day = String(eventDate.getDate()).padStart(2, "0");
    const month = String(eventDate.getMonth() + 1).padStart(2, "0");
    const year = eventDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Filter events based on search term
  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase())
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
    setCurrentModal("Add Event");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchEvents(); // Refresh the list after closing modal
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Event List</h3>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm me-2"
            style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
            onClick={handleAddEvent}
          >
            <i className="bi bi-plus-circle"></i> Add Event
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
                    # {sortOrder === "asc" ? "↑" : "↓"}
                  </th>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.map((event) => (
                  <tr key={event._id}>
                    <td className="fw-bold">{event.index}</td>
                    <td>{event.title}</td>
                    <td>{formatDate(event.date)}</td>
                    <td>{event.time || "N/A"}</td>
                    <td>{event.location || "No location"}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(event._id)}
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
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  className="btn btn-sm"
                  style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
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
        renderModalContent={() => <Event />}
      />
    </div>
  );
};

export default EventList;
