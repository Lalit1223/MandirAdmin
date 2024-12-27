import React, { useState } from "react";

// Exporting the user list as a named export
export const userList = [
  { id: 1, name: "Lalit Gandhi", email: "lalit@example.com", role: "Admin" },
  { id: 2, name: "Aditi Joshi", email: "aditi@example.com", role: "User" },
  { id: 3, name: "Rohan Patil", email: "rohan@example.com", role: "User" },
  { id: 4, name: "Ananya Mehta", email: "ananya@example.com", role: "Admin" },
  { id: 5, name: "Kunal Shah", email: "kunal@example.com", role: "User" },
  { id: 6, name: "Priya Singh", email: "priya@example.com", role: "User" },
];

const UserList = () => {
  const [users, setUsers] = useState(userList); // Manage user list
  const [searchTerm, setSearchTerm] = useState(""); // Search functionality
  const [sortAscending, setSortAscending] = useState(true); // Sort toggle
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 4; // Number of items per page

  // Delete a user by ID
  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Sort users by ID
  const handleSort = () => {
    const sortedUsers = [...users].sort((a, b) =>
      sortAscending ? a.id - b.id : b.id - a.id
    );
    setUsers(sortedUsers);
    setSortAscending(!sortAscending);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(
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
    <div className="container ">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">User List</h3>
        <div>
          <button
            className="btn btn-sm me-2"
            style={{
              backgroundColor: "#ff5722", // Primary theme color
              color: "#ffffff", // White text for contrast
            }}
            onClick={() => alert("Redirect to Add User Modal")}
          >
            <i className="bi bi-plus-circle"></i> Add User
          </button>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search user..."
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
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.id)}
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

export default UserList;
