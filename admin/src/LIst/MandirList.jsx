import React, { useState } from "react";

export const mandirListData = [
  {
    id: 1,
    name: "Shri Ram Mandir",
    location: "Ayodhya",
    status: "Live",
  },
  {
    id: 2,
    name: "Kashi Vishwanath Temple",
    location: "Varanasi",
    status: "Live",
  },
  {
    id: 3,
    name: "Jagannath Temple",
    location: "Puri",
    status: "Offline",
  },
  {
    id: 4,
    name: "Vaishno Devi Temple",
    location: "Jammu & Kashmir",
    status: "Live",
  },
  {
    id: 5,
    name: "Meenakshi Temple",
    location: "Madurai",
    status: "Offline",
  },
];

const MandirList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mandirList, setMandirList] = useState(mandirListData);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMandirList = mandirList.filter(
    (mandir) =>
      mandir.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mandir.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id) => {
    alert(`Edit functionality for Mandir ID: ${id}`);
    // Add your logic to handle edit functionality here
  };

  const handleAddMandir = () => {
    alert("Redirect to Add Mandir Modal");
    // Add your logic to redirect to the Add Mandir modal here
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Mandir List</h3>
        <div>
          <button
            className="btn btn-success btn-sm me-2"
            onClick={handleAddMandir}
          >
            <i className="bi bi-plus-circle"></i> Add Mandir
          </button>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search Mandir..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
          </div>
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
              <th>#</th>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMandirList.map((mandir) => (
              <tr
                key={mandir.id}
                className="align-middle"
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <td className="fw-bold">{mandir.id}</td>
                <td>{mandir.name}</td>
                <td>{mandir.location}</td>
                <td>
                  <span
                    className={`badge ${
                      mandir.status === "Live" ? "bg-success" : "bg-secondary"
                    }`}
                    style={{
                      padding: "0.5rem 1rem",
                      fontSize: "0.9rem",
                      borderRadius: "10px",
                    }}
                  >
                    {mandir.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(mandir.id)}
                  >
                    <i className="bi bi-pencil-square"></i> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MandirList;
