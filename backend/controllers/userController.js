const userModel = require("../models/userModel"); // Import model

const getAllUsers = async (req, res) => {
  try {
    const user = await userModel.getAllUsers();
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await userModel.updateUserStatus(id, status);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Status updated successfully." });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ error: "Failed to update status." });
  }
};

const getUsersCount = async (req, res) => {
  try {
    const count = await userModel.getUsersCount(); // Call the newly added function
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ error: "Failed to fetch user count." });
  }
};
module.exports = {
  getAllUsers,
  updateUserStatus,
  getUsersCount,
};
