import React, { useState, useEffect } from "react";
import Event from "./CMS/Event"; // Import Event form
import Mandir from "./CMS/Mandir";
import Book from "./CMS/Book";
import Suvichar from "./CMS/Suvichar";
import Navbar from "./Navbar";
import MandirList from "./LIst/MandirList";
import BookList from "./LIst/BookList";
import UserList from "./LIst/UserList";
import EventList from "./LIst/EventList";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Home.css"; // Add custom styles here
import Horoscope from "./CMS/Horoscope";
import OfflineMandir from "./LIst/OfflineMandir";
import { useNavigate } from "react-router-dom"; // Import the navigation hook
import axios from "axios";
import Modal from "./Modal"; // Import Modal component

const Home = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState(""); // Track which modal to show
  const [userCount, setUserCount] = useState(0);
  const [mandirCount, setMandirCount] = useState(0);
  const [offlineMandirCount, setOfflineMandirCount] = useState(0);
  const [liveMandirCount, setLiveMandirCount] = useState(0);

  const [eventCount, setEventCount] = useState(0);

  const [events, setEvents] = useState([]);

  const navigate = useNavigate(); // Hook for navigation

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleOpenModal = (modalType) => {
    setCurrentModal(modalType);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentModal("");
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const userResponse = await axios.get(
          "http://localhost:3000/api/users/count"
        );
        setUserCount(userResponse.data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }

      try {
        const mandirResponse = await axios.get(
          "http://localhost:3000/api/mandir"
        );
        const mandirs = mandirResponse.data; // Assuming this returns an array of mandirs
        const totalMandirCount = mandirs.length;
        const offlineMandirCount = mandirs.filter(
          (mandir) => mandir.status === 0
        ).length;

        const liveMandirCount = mandirs.filter(
          (mandir) => mandir.status === 1
        ).length;

        setMandirCount(totalMandirCount);
        setOfflineMandirCount(offlineMandirCount);
        setLiveMandirCount(liveMandirCount);
      } catch (error) {
        console.error("Error fetching Mandir data:", error);
      }

      try {
        const eventResponse = await axios.get(
          "http://localhost:3000/api/events/count"
        );
        setEventCount(eventResponse.data.count);
      } catch (error) {
        console.error("Error fetching event count:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
    fetchCount();
  }, []);
  const calendarEvents = events.map((event) => {
    const startDateTime = event.time
      ? new Date(`${event.date.split("T")[0]}T${event.time}`) // Combine date and time
      : new Date(event.date); // Default to just the date

    const endDateTime = event.time
      ? new Date(
          new Date(`${event.date.split("T")[0]}T${event.time}`).getTime() +
            60 * 60 * 1000
        ) // Default 1-hour duration
      : new Date(event.date); // Default end as the same date

    return {
      title: event.title,
      start: startDateTime,
      end: endDateTime,
      description: event.description,
      location: event.location,
      link: event.link,
    };
  });

  // Logout Handler
  const handleLogout = () => {
    // Clear user data (if stored in localStorage/sessionStorage)
    localStorage.removeItem("isAuthenticated"); // Assuming you store the token here
    sessionStorage.removeItem("userSession"); // Optional: clear session storage
    localStorage.removeItem("authToken"); // Assuming you store the token here

    // Redirect to login page
    navigate("/");
  };

  // const events = eventList.map((event) => ({
  //   title: event.name,
  //   start: new Date(event.date),
  //   end: new Date(event.date), // Single-day events
  //   category: event.category || "default", // Assuming events have a category
  // }));

  const localizer = momentLocalizer(moment);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="row">
            {[
              {
                title: " Users",
                value: `${userCount}`,
                icon: "bi bi-people icons",
              },
              {
                title: " Mandir",
                value: `${mandirCount}`,
                icon: "bi bi-building icons",
              },
              {
                title: " Events",
                value: `${eventCount}`,
                icon: "bi bi-calendar-event icons",
              },
              {
                title: "Live Mandir",
                value: `${liveMandirCount}`,
                icon: "bi bi-broadcast icons",
              },
              {
                title: "Offline Mandir",
                value: `${offlineMandirCount}`,
                icon: "bi bi-house icons",
              },
            ].map((item, index) => (
              <div className="col-6 col-sm-4 col-md-3 mb-4" key={index}>
                <div
                  className="card border-secondary shadow-sm text-center"
                  style={{
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                    padding: "15px", // Reduced padding
                    height: "auto", // Let the card height adjust based on content
                  }}
                >
                  <div className="card-body ">
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
                      events={calendarEvents}
                      startAccessor="start"
                      endAccessor="end"
                      style={{
                        height: "100%",
                        borderRadius: "10px",
                        fontFamily: "'Arial', sans-serif",
                      }}
                      eventPropGetter={() => ({
                        style: {
                          backgroundColor: "#ff5722", // Green background for all events
                          color: "#ffffff", // White text
                          borderRadius: "5px", // Rounded corners
                        },
                      })}
                      components={{
                        toolbar: () => (
                          <div
                            style={{
                              background:
                                "linear-gradient(120deg, #ff5722, #ecba80)",
                              color: "#fff",
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
        return <OfflineMandir />;
      case "userManagement":
        return <h3>User Management</h3>;
      default:
        return <h3>Select an option from the sidebar</h3>;
    }
  };

  const renderModalContent = () => {
    switch (currentModal) {
      case "Add Mandir":
        return <Mandir />;
      case "Add Event":
        return <Event />;
      case "Add Book":
        return <Book />;
      case "Add Suvichar":
        return <Suvichar />;
      case "Add Daily Horoscope":
        return <Horoscope />;
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
                  className={`btn btn-link text-start side_text  w-100 ${
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
                <button
                  className="btn btn-link text-start  w-100"
                  onClick={handleLogout}
                >
                  <i className="bi icon bi-box-arrow-right me-2"></i> Logout
                </button>
              </li>
            </ul>
          </div>

          <div className=" col-lg-10 p-4 main">{renderContent()}</div>
        </div>

        {/* Modal for Adding Event or Other CMS Options */}
        <Modal
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          currentModal={currentModal}
          renderModalContent={renderModalContent}
        />
      </div>
    </div>
  );
};

export default Home;
