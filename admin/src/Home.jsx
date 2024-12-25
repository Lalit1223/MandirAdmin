import React, { useState } from "react";
import { Link } from "react-router-dom";
import Event from "./CMS/Event"; // Import Event form
import Mandir from "./CMS/Mandir";
import Book from "./CMS/Book";
import Suvichar from "./CMS/Suvichar";
import History from "./CMS/History";
import Navbar from "./Navbar";
import MandirList, { mandirList } from "./LIst/MandirList";
import BookList from "./LIst/BookList";
import UserList, { userList } from "./LIst/UserList";
import EventList, { eventList } from "./LIst/EventList";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css"; // Add custom styles here

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
  }));

  var EventCount = eventList.length;
  var UserCount = userList.length;
  var MandirCount = mandirList.length;

  const liveMandirs = mandirList.filter((mandir) => mandir.status === "Live");
  var liveCount = liveMandirs.length;

  const offlineMandirs = mandirList.filter(
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
                title: "Total Users",
                value: `${UserCount}`,
                icon: "bi bi-people",
              },
              {
                title: "Total Temples",
                value: `${MandirCount}`,
                icon: "bi bi-building",
              },
              {
                title: "Total Events",
                value: `${EventCount}`,
                icon: "bi bi-calendar-event",
              },
              {
                title: "Live Mandir",
                value: `${liveCount}`,
                icon: "bi bi-broadcast",
              },
              {
                title: "Offline Mandir",
                value: `${offlineCount}`,
                icon: "bi bi-house",
              },
            ].map((item, index) => (
              <div className="col-md-4 mb-3 " key={index}>
                <div
                  className="card border-secondary shadow-sm  text-center"
                  style={{
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                  }}
                >
                  <div className="card-body">
                    <i
                      className={`${item.icon} text-primary mb-3`}
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <h5 className="card-title">{item.title}</h5>
                    <h3 className="text-primary fw-bold">{item.value}</h3>
                    <p className="text-muted">
                      Details about {item.title.toLowerCase()}.
                    </p>
                  </div>
                </div>
                {/* Calendar Card */}
              </div>
            ))}
            {/* Calendar Card */}
            <div className="col-md-12">
              <div
                className="card card-cal border-secondary shadow-sm"
                style={{
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">Event Calendar</h5>
                  <div style={{ height: "500px" }}>
                    <Calendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: "100%" }}
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
              "Add Mandir",
              "Add Event",
              "Add Book",
              "Add Suvichar",
              "Add Indian History",
            ].map((item, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card border-secondary">
                  <div className="card-body">
                    <h5 className="card-title">{item}</h5>
                    <p className="card-text">
                      Manage {item.toLowerCase()} here.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleOpenModal(item)}
                    >
                      Add {item}
                    </button>
                  </div>
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
      case "Add Indian History":
        return <History />; // Add form for Indian History
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
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "cms" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("cms")}
                >
                  <i className="bi bi-layout-text-sidebar me-2"></i> CMS
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "mandirList" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("mandirList")}
                >
                  <i className="bi bi-list-ul me-2"></i> Mandir List
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "userList" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("userList")}
                >
                  <i className="bi bi-people me-2"></i> User List
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "eventList" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("eventList")}
                >
                  <i className="bi bi-calendar-event me-2"></i> Event List
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "bookList" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("bookList")}
                >
                  <i className="bi bi-book me-2"></i> Book List
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "offlineMandir" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("offlineMandir")}
                >
                  <i className="bi bi-building me-2"></i> Offline Mandir
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`btn btn-link text-start  w-100 ${
                    activeTab === "userManagement" ? "fw-bold  rounded" : ""
                  }`}
                  onClick={() => handleTabChange("userManagement")}
                >
                  <i className="bi bi-person-circle me-2"></i> User Management
                </button>
              </li>
              <li className="nav-item mb-3">
                <button className="btn btn-link text-start  w-100">
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </li>
            </ul>
          </div>

          <div className=" col-lg-10 p-4 main">{renderContent()}</div>
        </div>

        {/* Modal for Adding Event or Other CMS Options */}
        {showModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{currentModal}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">{renderModalContent()}</div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
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
