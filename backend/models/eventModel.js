const pool = require("../config/db"); // Import the connection pool

// Add Event
const addEvent = async (eventData) => {
  const query = `
    INSERT INTO events (
      title, location, date, time, description, link, banner_image
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    eventData.title,
    eventData.location,
    eventData.date,
    eventData.time,
    eventData.description,
    eventData.link,
    eventData.banner_image, // Path or URL of the uploaded image
  ];

  try {
    const [result] = await pool.query(query, values);
    return result.insertId; // Return the newly inserted event ID
  } catch (err) {
    throw new Error("Failed to add event");
  }
};

// Update Event
const updateEvent = async (eventId, eventData) => {
  const query = `
    UPDATE events SET
      title = ?, 
      location = ?, 
      date = ?, 
      time = ?, 
      description = ?, 
      link = ?, 
      banner_image = ?
    WHERE id = ?
  `;

  const values = [
    eventData.title,
    eventData.location,
    eventData.date,
    eventData.time,
    eventData.description,
    eventData.link,
    eventData.banner_image, // Path or URL of the uploaded image
    eventId,
  ];

  try {
    const [result] = await pool.query(query, values);
    return result.affectedRows; // Return the number of affected rows
  } catch (err) {
    throw new Error("Failed to update event");
  }
};

// Delete Event
const deleteEvent = async (eventId) => {
  const query = `DELETE FROM events WHERE id = ?`;

  try {
    const [result] = await pool.query(query, [eventId]);
    return result.affectedRows; // Return the number of affected rows
  } catch (err) {
    throw new Error("Failed to delete event");
  }
};

// Get All Events
const getAllEvents = async () => {
  const query = `SELECT * FROM events`;

  try {
    const [rows] = await pool.query(query);
    return rows; // Return all events
  } catch (err) {
    throw new Error("Failed to fetch events");
  }
};

// Get Event By ID
const getEventById = async (eventId) => {
  const query = `SELECT * FROM events WHERE id = ?`;

  try {
    const [rows] = await pool.query(query, [eventId]);
    return rows[0]; // Return the event with the given ID
  } catch (err) {
    throw new Error("Failed to fetch event");
  }
};

const getEventsCount = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM events");
  return rows[0].count;
};
module.exports = {
  addEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getEventsCount,
};
