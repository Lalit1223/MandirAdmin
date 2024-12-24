import React from "react";

export const mandirList = [
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
  // Static mandir list

  return (
    <div>
      <h3>Mandir List</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {mandirList.map((mandir) => (
            <tr key={mandir.id}>
              <td>{mandir.id}</td>
              <td>{mandir.name}</td>
              <td>{mandir.location}</td>
              <td>
                <span
                  className={`badge ${
                    mandir.status === "Live" ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {mandir.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MandirList;
