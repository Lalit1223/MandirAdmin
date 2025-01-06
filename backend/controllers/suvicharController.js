const {
  addSuvicharImage,
  deleteSuvicharImage,
  getAllSuvicharImages,
} = require("../models/suvicharModel");
const { saveBase64File } = require("../config/saveBase64File");

const uploadSuvicharImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image data is required" });
    }

    const imagePath = saveBase64File(image, "uploads", "suvichar");
    const insertId = await addSuvicharImage(imagePath);

    res
      .status(201)
      .json({
        message: "Suvichar image uploaded successfully",
        id: insertId,
        imagePath,
      });
  } catch (error) {
    console.error("Error uploading Suvichar image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchAllSuvicharImages = async (req, res) => {
  try {
    const images = await getAllSuvicharImages();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching Suvichar images:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeSuvicharImage = async (req, res) => {
  try {
    const { id } = req.params;

    const affectedRows = await deleteSuvicharImage(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Suvichar image not found" });
    }

    res.status(200).json({ message: "Suvichar image deleted successfully" });
  } catch (error) {
    console.error("Error deleting Suvichar image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  uploadSuvicharImage,
  fetchAllSuvicharImages,
  removeSuvicharImage,
};
