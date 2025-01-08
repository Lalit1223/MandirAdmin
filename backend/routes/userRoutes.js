const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  getUsersCount,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.patch("/:id/status", updateUserStatus);
router.get("/count", getUsersCount);

module.exports = router;
