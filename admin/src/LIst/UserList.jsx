import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Home.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users`);
      console.log("User response:", response.data);

      if (!response.data.error) {
        const userData = response.data.users || response.data;
        setUsers(Array.isArray(userData) ? userData : []);
      } else {
        console.error("Error from server:", response.data.message);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedList = [...users].sort((a, b) =>
      newSortOrder === "asc" ? a.id - b.id : b.id - a.id
    );
    setUsers(sortedList);
    setSortOrder(newSortOrder);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      await axios.patch(`${API_URL}/api/users/${id}/status`, {
        status: newStatus,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );
      alert("Status updated successfully.");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">User List</h3>
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
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
      ) : users.length === 0 ? (
        <div className="text-center my-4">
          <i
            className="bi bi-people text-muted"
            style={{ fontSize: "2rem" }}
          ></i>
          <p className="text-muted mt-2">No users available</p>
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
                  <th>Email</th>
                  <th>Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-bold">{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile_number || "N/A"}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.status === 1 ? "bg-success" : "bg-secondary"
                        }`}
                        style={{
                          fontSize: "0.9rem",
                          borderRadius: "10px",
                        }}
                      >
                        {user.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={user.status === 1}
                          onChange={() => toggleStatus(user.id, user.status)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length > 0 && (
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
                  Showing {currentUsers.length} of {filteredUsers.length}{" "}
                  records
                </span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
