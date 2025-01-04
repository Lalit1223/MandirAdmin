const express = require("express");
const {
  addNewEvent,
  updateExistingEvent,
  deleteEventById,
  getAllEventsList,
  getEventDetails,
} = require("../controllers/eventController");

const router = express.Router();

router.post("/", addNewEvent); // Add a new event
router.put("/:id", updateExistingEvent); // Update an event
router.delete("/:id", deleteEventById); // Delete an event
router.get("/", getAllEventsList); // Get all events
router.get("/:id", getEventDetails); // Get event by ID

module.exports = router;
