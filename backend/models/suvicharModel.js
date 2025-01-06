// Suvichar Model
const pool = require("../config/db");

// Add Suvichar Image
const addSuvicharImage = async (imagePath) => {
  const query = `INSERT INTO suvichar (image_path) VALUES (?)`;
  try {
    const [result] = await pool.query(query, [imagePath]);
    return result.insertId; // Return the ID of the inserted record
  } catch (err) {
    throw new Error("Failed to add suvichar image: " + err.message);
  }
};

// Delete Suvichar Image
const deleteSuvicharImage = async (imageId) => {
  const query = `DELETE FROM suvichar WHERE id = ?`;
  try {
    const [result] = await pool.query(query, [imageId]);
    return result.affectedRows; // Return number of rows deleted
  } catch (err) {
    throw new Error("Failed to delete suvichar image: " + err.message);
  }
};

// Get All Suvichar Images
const getAllSuvicharImages = async () => {
  const query = `SELECT id, image_path FROM suvichar`;
  try {
    const [rows] = await pool.query(query);
    return rows; // Return all suvichar images
  } catch (err) {
    throw new Error("Failed to fetch suvichar images: " + err.message);
  }
};

module.exports = {
  addSuvicharImage,
  deleteSuvicharImage,
  getAllSuvicharImages,
};
