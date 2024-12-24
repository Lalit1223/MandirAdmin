import React from "react";

export const userList = [
  { id: 1, name: "Lalit Gandhi", email: "lalit@example.com", role: "Admin" },
  { id: 2, name: "Aditi Joshi", email: "aditi@example.com", role: "User" },
  { id: 3, name: "Rohan Patil", email: "rohan@example.com", role: "User" },
];
export default function UserList() {
  return (
    <div>
      <h3>User List</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
