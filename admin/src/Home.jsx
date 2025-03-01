import React, { useState, useEffect } from "react";
import Event from "./CMS/Event";
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
import "./Home.css";
import Horoscope from "./CMS/Horoscope";
import OfflineMandir from "./LIst/OfflineMandir";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";
import Avatar from "./CMS/Avatar";
const localizer = momentLocalizer(moment);

const Home = () => {
  const navigate = useNavigate();
  const API_URL =
    import.meta.env.VITE_API_URL || "https://man-mandir.onrender.com";

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [mandirCount, setMandirCount] = useState(0);
  const [offlineMandirCount, setOfflineMandirCount] = useState(0);
  const [liveMandirCount, setLiveMandirCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState({
    users: false,
    mandirs: false,
    events: false,
    books: false,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (!authToken || isAuth !== "true") {
      // Redirect to login if not authenticated
      navigate("/");
    } else {
      setIsAuthenticated(true);
      fetchCounts();
      fetchEvents();
    }
  }, [navigate]);

  const handleListError = (type, message) => {
    console.error(`${type} Error:`, message);
    setLoading((prev) => ({ ...prev, [type]: false }));
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleOpenModal = (modalType) => {
    setCurrentModal(modalType);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentModal("");
    // Refresh counts after closing a modal
    fetchCounts();
    if (currentModal === "Add Event") {
      fetchEvents();
    }
  };

  const fetchCounts = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        navigate("/");
        return;
      }

      // Use the single endpoint for counts
      const response = await axios.get(`${API_URL}/admin/counts`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        const countData = response.data.data;
        setUserCount(countData.users || 0);
        setMandirCount(countData.mandirs || 0);
        setEventCount(countData.events || 0);

        // Use the directly provided online/offline mandir counts
        setLiveMandirCount(countData.onlineMandir || 0);
        setOfflineMandirCount(countData.offlineMandir || 0);
      } else {
        console.error("Error fetching counts:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/");
      }
    }
  };

  const fetchEvents = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        navigate("/");
        return;
      }

      const response = await axios.get(`${API_URL}/event/admin/get`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        setEvents(response.data.data || []);
      } else {
        console.error("Error fetching events:", response.data.message);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/");
      }
      setEvents([]);
    }
  };

  const calendarEvents = Array.isArray(events)
    ? events.map((event) => {
        // Extract date part and handle time
        const eventDate = new Date(event.date);
        const timeStr = event.time || "00:00";
        const [hours, minutes] = timeStr.split(":").map(Number);

        // Create start date with time
        const startDateTime = new Date(eventDate);
        startDateTime.setHours(hours, minutes, 0);

        // Create end date (1 hour after start)
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(endDateTime.getHours() + 1);

        return {
          title: event.title,
          start: startDateTime,
          end: endDateTime,
          description: event.description,
          location: event.location,
          link: event.link,
          _id: event._id,
        };
      })
    : [];

  // Logout Handler
  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authToken");
    localStorage.removeItem("admin");
    sessionStorage.removeItem("userSession");

    // Redirect to login page
    navigate("/");
  };

  const handleEventSelect = async (event) => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        navigate("/");
        return;
      }

      const response = await axios.get(
        `${API_URL}/event/admin/get/${event._id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        const eventDetails = response.data.data;
        alert(
          `Event: ${eventDetails.title}\nDate: ${new Date(
            eventDetails.date
          ).toLocaleDateString()}\nTime: ${
            eventDetails.time || "N/A"
          }\nLocation: ${
            eventDetails.location || "No location"
          }\nDescription: ${eventDetails.description || "No description"}`
        );
      } else {
        alert(
          `Event: ${event.title}\nDescription: ${
            event.description || "No description"
          }\nLocation: ${event.location || "No location"}`
        );
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      alert(
        `Event: ${event.title}\nDescription: ${
          event.description || "No description"
        }\nLocation: ${event.location || "No location"}`
      );
    }
  };

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
                    padding: "15px",
                    height: "auto",
                  }}
                >
                  <div className="card-body ">
                    <i
                      className={`${item.icon} text-primary mb-2`}
                      style={{ fontSize: "1.5rem" }}
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
                  background: "#f4f6f9",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="card-body">
                  <div
                    style={{
                      height: "300px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      background: "#ffffff",
                      border: "2px solid #ddd",
                    }}
                  >
                    {events && events.length > 0 ? (
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
                            backgroundColor: "#ff5722",
                            color: "#ffffff",
                            borderRadius: "5px",
                          },
                        })}
                        components={{
                          toolbar: (toolbarProps) => (
                            <div
                              style={{
                                padding: "10px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background:
                                  "linear-gradient(120deg, #ff5722, #ecba80)",
                                color: "#fff",
                              }}
                            >
                              <div>
                                <button
                                  onClick={() =>
                                    toolbarProps.onNavigate("PREV")
                                  }
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor: "white",
                                    color: "#black",
                                    marginRight: "5px",
                                    border: "none",
                                  }}
                                >
                                  <i className="bi bi-chevron-left"></i>
                                </button>
                                <button
                                  onClick={() =>
                                    toolbarProps.onNavigate("NEXT")
                                  }
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor: "white",
                                    color: "black",
                                    marginRight: "10px",
                                    border: "none",
                                  }}
                                >
                                  <i className="bi bi-chevron-right"></i>
                                </button>
                              </div>

                              <span style={{ fontWeight: "bold" }}>
                                Event Calendar - {toolbarProps.label}
                              </span>

                              <div>
                                <button
                                  onClick={() => toolbarProps.onView("month")}
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor:
                                      toolbarProps.view === "month"
                                        ? "#ff5722"
                                        : "rgba(255, 86, 34, 0.25)",
                                    color: "#fff",
                                    marginRight: "5px",
                                    border: "none",
                                  }}
                                >
                                  Month
                                </button>
                                <button
                                  onClick={() => toolbarProps.onView("week")}
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor:
                                      toolbarProps.view === "week"
                                        ? "#ff5722"
                                        : "rgba(255, 86, 34, 0.25)",
                                    color: "#fff",
                                    marginRight: "5px",
                                    border: "none",
                                  }}
                                >
                                  Week
                                </button>
                                <button
                                  onClick={() => toolbarProps.onView("day")}
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor:
                                      toolbarProps.view === "day"
                                        ? "#ff5722"
                                        : "rgba(255, 86, 34, 0.25)",
                                    color: "#fff",
                                    border: "none",
                                  }}
                                >
                                  Day
                                </button>
                              </div>
                            </div>
                          ),
                        }}
                        tooltipAccessor={(event) =>
                          `${event.title} - ${
                            event.description || "No description"
                          }`
                        }
                        onSelectEvent={handleEventSelect}
                        popup
                        selectable
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <i
                          className="bi bi-calendar-x text-muted"
                          style={{ fontSize: "2rem" }}
                        ></i>
                        <p className="text-muted">No events available</p>
                      </div>
                    )}
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
                icon: "bi bi-building icons",
              },
              {
                title: "Add Event",
                icon: "bi bi-calendar-event icons",
              },
              {
                title: "Add Book",
                icon: "bi bi-book icons",
              },
              {
                title: "Add Suvichar",
                icon: "bi bi-chat-quote icons",
              },
              {
                title: "Add Daily Horoscope",
                icon: "bi bi-moon-stars icons",
              },
              {
                title: "Add User Avatars",
                icon: "bi bi-person-circle icons",
              },
            ].map((item, index) => (
              <div className="col-6 col-sm-4 col-md-3 mb-4" key={index}>
                <div
                  className="card border-secondary shadow-sm text-center"
                  style={{
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                    height: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
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
        return (
          <MandirList
            onError={(message) => handleListError("mandirs", message)}
          />
        );

      case "userList":
        return (
          <UserList onError={(message) => handleListError("users", message)} />
        );

      case "eventList":
        return (
          <EventList
            onError={(message) => handleListError("events", message)}
          />
        );

      case "bookList":
        return (
          <BookList onError={(message) => handleListError("books", message)} />
        );

      case "offlineMandir":
        return (
          <OfflineMandir
            onError={(message) => handleListError("offlineMandirs", message)}
          />
        );
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
      case "Add User Avatars":
        return <Avatar />;
      default:
        return <h4>Unknown Action</h4>;
    }
  };

  if (!isAuthenticated) {
    return <div className="loading">Checking authentication...</div>;
  }

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
