// Reuse saveBase64File utility if already created
const { saveBase64File } = require("../config/saveBase64File");
const eventModel = require("../models/eventModel"); // Correctly import eventModel

// Add Event
const addNewEvent = async (req, res) => {
  const { title, location, date, time, description, link, bannerImage } =
    req.body;

  try {
    const imagePath = saveBase64File(bannerImage, "uploads", "event");
    const eventId = await eventModel.addEvent({
      title,
      location,
      date,
      time,
      description,
      link,
      banner_image: imagePath,
    });

    res.status(201).json({ message: "Event added successfully", eventId });
  } catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ error: "Failed to add event." });
  }
};

// Update Event
const updateExistingEvent = async (req, res) => {
  const { id } = req.params;
  const { title, location, date, time, description, link, bannerImage } =
    req.body;

  try {
    let imagePath = null;
    if (bannerImage) {
      imagePath = saveBase64File(bannerImage, "uploads", "event");
    }

    const updated = await eventModel.updateEvent(id, {
      title,
      location,
      date,
      time,
      description,
      link,
      banner_image: imagePath,
    });

    if (!updated) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.status(200).json({ message: "Event updated successfully." });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event." });
  }
};

// Delete Event
const deleteEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await eventModel.deleteEvent(id);

    if (deleted) {
      res.status(200).json({ message: "Event deleted successfully" });
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
};

// Get All Events
const getAllEventsList = async (req, res) => {
  try {
    const events = await eventModel.getAllEvents();
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Get Event by ID
const getEventDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await eventModel.getEventById(id);

    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

const getEventsCount = async (req, res) => {
  try {
    const count = await eventModel.getEventsCount(); // Call the newly added function
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching event count:", error);
    res.status(500).json({ error: "Failed to fetch event count." });
  }
};

module.exports = {
  addNewEvent,
  updateExistingEvent,
  deleteEventById,
  getAllEventsList,
  getEventDetails,
  getEventsCount,
};
