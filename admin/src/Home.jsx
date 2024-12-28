import React, { useState } from "react";
import Event from "./CMS/Event"; // Import Event form
import Mandir from "./CMS/Mandir";
import Book from "./CMS/Book";
import Suvichar from "./CMS/Suvichar";
import Navbar from "./Navbar";
import MandirList, { mandirListData } from "/src/List/MandirList.jsx";
import BookList from "./LIst/BookList";
import UserList, { userList } from "./LIst/UserList";
import EventList, { eventList } from "./LIst/EventList";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css"; // Add custom styles here
import Horoscope from "./CMS/Horoscope";

const Home = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState(""); // Track which modal to show

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleOpenModal = (modalType) => {
    setCurrentModal(modalType);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentModal(""); // Reset the current modal type
  };

  const events = eventList.map((event) => ({
    title: event.name,
    start: new Date(event.date),
    end: new Date(event.date), // Single-day events
    category: event.category || "default", // Assuming events have a category
  }));

  var EventCount = eventList.length;
  var UserCount = userList.length;
  var MandirCount = mandirListData.length;

  const liveMandirs = mandirListData.filter(
    (mandir) => mandir.status === "Live"
  );
  var liveCount = liveMandirs.length;

  const offlineMandirs = mandirListData.filter(
    (mandir) => mandir.status === "Offline"
  );
  var offlineCount = offlineMandirs.length;

  const localizer = momentLocalizer(moment);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="row">
            {[
              {
                title: " Users",
                value: `${UserCount}`,
                icon: "bi bi-people icons",
              },
              {
                title: " Mandir",
                value: `${MandirCount}`,
                icon: "bi bi-building icons",
              },
              {
                title: " Events",
                value: `${EventCount}`,
                icon: "bi bi-calendar-event icons",
              },
              {
                title: "Live Mandir",
                value: `${liveCount}`,
                icon: "bi bi-broadcast icons",
              },
              {
                title: "Offline Mandir",
                value: `${offlineCount}`,
                icon: "bi bi-house icons",
              },
            ].map((item, index) => (
              <div className="col-6 col-sm-4 col-md-3 mb-4" key={index}>
                <div
                  className="card border-secondary shadow-sm text-center"
                  style={{
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                    padding: "10px", // Reduced padding
                    height: "auto", // Let the card height adjust based on content
                  }}
                >
                  <div className="card-body">
                    <i
                      className={`${item.icon} text-primary mb-2`}
                      style={{ fontSize: "1.5rem" }} // Smaller icon size
                    ></i>
                    <h6 className="card-title">{item.title}</h6>
                    <h4 className="text-primary fw-bold">{item.value}</h4>
                  </div>
                </div>
              </div>
            ))}
            {/* Calendar Card */}
            <div className="col-12 col-md-6 mb-4">
              <div
                className="card card-cal border-secondary shadow-sm"
                style={{
                  borderRadius: "12px",
                  background: "#f4f6f9", // Light gray background for card
                  padding: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow for card
                }}
              >
                <div className="card-body">
                  <div
                    style={{
                      height: "300px",
                      borderRadius: "10px",
                      overflow: "hidden", // Ensures smooth corners for the calendar
                      background: "#ffffff", // White background for the calendar
                      border: "2px solid #ddd", // Border to define calendar edges
                    }}
                  >
                    <Calendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      style={{
                        height: "100%",
                        borderRadius: "10px", // Smooth corners for the calendar itself
                        fontFamily: "'Arial', sans-serif", // Clean font for readability
                      }}
                      components={{
                        event: ({ event }) => (
                          <span
                            style={{
                              backgroundColor: "#ffb74d",
                              padding: "5px",
                              borderRadius: "5px",
                              color: "#fff",
                              display: "block",
                              fontWeight: "bold",
                              fontSize: "0.9rem",
                            }}
                          >
                            {event.title}
                          </span>
                        ),
                        toolbar: () => (
                          <div
                            style={{
                              background:
                                "linear-gradient(120deg, #ff5722 ,rgb(236, 186, 128))", // Colorful gradient for header
                              color: "#fff", // White text color in header
                              padding: "10px",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            <span>Event Calendar</span>
                          </div>
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "cms":
        return (
          <div className="row">
            {[
              {
                title: "Add Mandir",
                icon: "bi bi-building icons", // Temple icon
              },
              {
                title: "Add Event",
                icon: "bi bi-calendar-event icons", // Event icon
              },
              {
                title: "Add Book",
                icon: "bi bi-book icons", // Book icon
              },
              {
                title: "Add Suvichar",
                icon: "bi bi-chat-quote icons", // Good thoughts icon
              },
              {
                title: "Add Daily Horoscope",
                icon: "bi bi-moon-stars icons", // History icon
              },
            ].map((item, index) => (
              <div className="col-6 col-sm-4 col-md-3 mb-4" key={index}>
                <div
                  className="card border-secondary shadow-sm text-center"
                  style={{
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                    height: "200px", // Fixed height for uniformity
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between", // Ensures even spacing
                    padding: "10px",
                  }}
                >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    <i
                      className={`${item.icon} text-primary mb-2`}
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                    <h6 className="card-title mb-2">{item.title}</h6>
                  </div>
                  <button
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "#ff5722",
                      color: "#fff",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      padding: "8px 16px",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleOpenModal(item.title)}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#e64a19")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#ff5722")
                    }
                  >
                    {item.title}
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case "mandirList":
        return <MandirList />;
      case "userList":
        return <UserList />;
      case "eventList":
        return <EventList />;
      case "bookList":
        return <BookList />;
      case "offlineMandir":
        return <h3>Offline Mandir</h3>;
      case "userManagement":
        return <h3>User Management</h3>;
      default:
        return <h3>Select an option from the sidebar</h3>;
    }
  };

  const renderModalContent = () => {
    switch (currentModal) {
      case "Add Mandir":
        return <Mandir />; // Add form for Mandir
      case "Add Event":
        return <Event />; // Event form
      case "Add Book":
        return <Book />; // Add form for Book
      case "Add Suvichar":
        return <Suvichar />; // Add form for Suvichar
      case "Add Daily Horoscope":
        return <Horoscope />; // Add form for Indian History
      default:
        return <h4>Unknown Action</h4>;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid ">
        <div className="row">
          <div className="col-lg-2 text-white  p-3 sidebar">
            <ul className="nav flex-column">
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "dashboard" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("dashboard")}
                >
                  <i
                    className={`bi bi-speedometer2 me-2 ${
                      activeTab === "dashboard" ? "text-white" : "icon"
                    }`}
                  ></i>{" "}
                  Dashboard
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "cms" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("cms")}
                >
                  <i
                    className={`bi icon bi-layout-text-sidebar me-2 ${
                      activeTab === "cms" ? "text-white" : "icon"
                    }`}
                  ></i>{" "}
                  CMS
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "mandirList" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("mandirList")}
                >
                  <i
                    className={`bi icon bi-list-ul me-2 ${
                      activeTab === "mandirList" ? "text-white" : "icon"
                    }`}
                  ></i>{" "}
                  Mandir List
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "userList" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("userList")}
                >
                  <i
                    className={`bi icon bi-people me-2 ${
                      activeTab === "userList" ? "text-white" : "icon"
                    }`}
                  ></i>{" "}
                  User List
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "eventList" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("eventList")}
                >
                  <i
                    className={`bi icon bi-calendar-event me-2 ${
                      activeTab === "eventList" ? "text-white" : "icon"
                    }`}
                  ></i>{" "}
                  Event List
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "bookList" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("bookList")}
                >
                  <i
                    className={`bi icon bi-book me-2 ${
                      activeTab === "bookList" ? "text-white" : "icon"
                    }`}
                  ></i>{" "}
                  Book List
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "offlineMandir" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("offlineMandir")}
                >
                  <i
                    className={`bi icon bi-building me-2 ${
                      activeTab === "offlineMandir" ? "text-white" : "icon"
                    }`}
                  ></i>{" "}
                  Offline Mandir
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "userManagement" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("userManagement")}
                >
                  <i
                    className={`bi icon bi-person-circle me-2 ${
                      activeTab === "userManagement" ? "text-white" : "icon"
                    }`}
                  ></i>{" "}
                  User Management
                </button>
              </li>
              <li className="nav-item mb-3">
                <button className="btn btn-link text-start  w-100">
                  <i className="bi icon bi-box-arrow-right me-2"></i> Logout
                </button>
              </li>
            </ul>
          </div>

          <div className=" col-lg-10 p-4 main">{renderContent()}</div>
        </div>

        {/* Modal for Adding Event or Other CMS Options */}
        {/* Modal for Adding Event or Other CMS Options */}
        {showModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-md">
              {" "}
              {/* Changed from modal-lg to modal-md */}
              <div className="modal-content">
                <div
                  className="modal-header"
                  style={{
                    backgroundColor: "#ff5722", // Primary theme color
                    color: "#ffffff", // Text color for contrast
                  }}
                >
                  <h5 className="modal-title">{currentModal}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    style={{ backgroundColor: "#ffffff", color: "#ff5722" }} // Contrast close button
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div
                  className="modal-body"
                  style={{
                    backgroundColor: "#fef3eb", // Complementary light color for body
                    color: "#333333", // Neutral text color
                  }}
                >
                  {renderModalContent()}
                </div>
                <div
                  className="modal-footer"
                  style={{
                    backgroundColor: "#fef3eb", // Match modal body
                    borderTop: "1px solid #ff5722", // Optional separator
                  }}
                >
                  <button
                    type="button"
                    className="btn"
                    style={{
                      backgroundColor: "#ff5722", // Primary theme color
                      color: "#ffffff", // White text for contrast
                    }}
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
