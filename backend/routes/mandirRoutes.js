const express = require("express");
const router = express.Router();
const {
  addMandir,
  updateMandir,
  deleteMandir,
  getAllMandirs,
  getMandirById,
} = require("../controllers/mandirController");

// Route to get all Mandirs
router.get("/", getAllMandirs);

// Route to get a Mandir by ID
router.get("/:id", getMandirById);

// Route to add Mandir
router.post("/", addMandir);

// Route to update Mandir
router.put("/:id", updateMandir);

// Route to delete Mandir
router.delete("/:id", deleteMandir);

module.exports = router;
