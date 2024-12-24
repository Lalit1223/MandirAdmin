import React from "react";
export const eventList = [
  {
    id: 1,
    name: "Diwali Celebration",
    date: "2024-11-12",
    location: "Ayodhya",
  },
  { id: 2, name: "Chhath Puja", date: "2024-11-19", location: "Patna" },
  { id: 3, name: "Kumbh Mela", date: "2025-01-14", location: "Haridwar" },
];

export default function EventList() {
  return (
    <div>
      <h3>Event List</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Event Name</th>
            <th>Date</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {eventList.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.name}</td>
              <td>{event.date}</td>
              <td>{event.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
