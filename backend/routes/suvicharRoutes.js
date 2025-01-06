const express = require("express");
const {
  uploadSuvicharImage,
  fetchAllSuvicharImages,
  removeSuvicharImage,
} = require("../controllers/suvicharController");

const router = express.Router();

router.post("/", uploadSuvicharImage); // Upload an image
router.get("/", fetchAllSuvicharImages); // Fetch all images
router.delete("/:id", removeSuvicharImage); // Delete an image by ID

module.exports = router;
