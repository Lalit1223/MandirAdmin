import React, { useState } from "react";

// Exporting the event list as a named export
export const eventList = [
  {
    id: 1,
    name: "Diwali Celebration",
    date: "2024-11-12",
    location: "Ayodhya",
  },
  { id: 2, name: "Chhath Puja", date: "2024-11-19", location: "Patna" },
  { id: 3, name: "Maha Aarti", date: "2024-12-10", location: "Haridwar" },
  { id: 4, name: "Kumbh Mela", date: "2025-01-14", location: "Haridwar" },
  { id: 5, name: "Janmashtami", date: "2024-08-26", location: "Mathura" },
  { id: 6, name: "Holi Festival", date: "2025-03-24", location: "Vrindavan" },
];

const EventList = () => {
  const [events, setEvents] = useState(eventList); // Manage event list
  const [searchTerm, setSearchTerm] = useState(""); // Search functionality
  const [sortAscending, setSortAscending] = useState(true); // Sort toggle
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 4; // Number of items per page

  // Delete an event by ID
  const handleDelete = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  // Sort events by ID
  const handleSort = () => {
    const sortedEvents = [...events].sort((a, b) =>
      sortAscending ? a.id - b.id : b.id - a.id
    );
    setEvents(sortedEvents);
    setSortAscending(!sortAscending);
  };

  // Filter events based on search term
  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Event List</h3>
        <div>
          <button
            className="btn btn-sm me-2"
            style={{
              backgroundColor: "#ff5722", // Primary theme color
              color: "#ffffff", // White text for contrast
            }}
            onClick={() => alert("Redirect to Add Event Modal")}
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
                ID {sortAscending ? "↑" : "↓"}
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
                <td>{event.id}</td>
                <td>{event.name}</td>
                <td>{event.date}</td>
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

export default EventList;
