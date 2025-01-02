const express = require("express");

const router = express.Router();
const {
  addMandir,
  updateMandir,
  deleteMandir,
} = require("../controllers/mandirController");

// Route to add Mandir with image upload
router.post("/", addMandir); // Accepts up to 5 images

// Route to update Mandir with image upload
router.put("/:id", updateMandir);
router.delete("/:id", deleteMandir); // Delete a Mandir by ID

module.exports = router;
