const mandirModel = require("../models/mandirModel"); // Import model
const path = require("path");
const fs = require("fs");

const addMandir = async (req, res) => {
  const {
    title,
    nickname,
    description,
    youtube_live_link,
    offline_video_morning,
    offline_video_evening,
    offline_video_night,
    aarti_time_morning,
    aarti_time_evening,
    aarti_time_night,
    map_link,
    images, // expecting base64 images in the request body
  } = req.body;

  // Decode base64 images and store in the "uploads" directory
  let imageUrls = [];
  if (images && images.length > 0) {
    try {
      imageUrls = await Promise.all(
        images.map(async (image) => {
          const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}.jpg`;
          const filePath = path.join(__dirname, "../uploads", fileName);

          // Write the base64 data to a file in the "uploads" folder
          fs.writeFileSync(filePath, base64Data, "base64");

          // Return the path where the image is saved
          return `/uploads/${fileName}`;
        })
      );
    } catch (err) {
      console.error("Error saving base64 images:", err);
      return res.status(500).json({ error: "Failed to save images." });
    }
  }

  try {
    // Call the model to add mandir
    const mandirId = await mandirModel.addMandir({
      title,
      nickname,
      description,
      youtube_live_link,
      offline_video_morning,
      offline_video_evening,
      offline_video_night,
      aarti_time_morning,
      aarti_time_evening,
      aarti_time_night,
      map_link,
      images: imageUrls,
    });

    res.status(201).json({
      message: "Mandir added successfully.",
      mandirId,
    });
  } catch (err) {
    console.error("Error adding mandir:", err);
    res.status(500).json({ error: "Failed to add mandir." });
  }
};

const updateMandir = async (req, res) => {
  const mandirId = req.params.id;
  const {
    title,
    nickname,
    description,
    youtube_live_link,
    offline_video_morning,
    offline_video_evening,
    offline_video_night,
    aarti_time_morning,
    aarti_time_evening,
    aarti_time_night,
    map_link,
    images, // expecting base64 images in the request body
  } = req.body;

  // Decode base64 images and store in the "uploads" directory
  let imageUrls = [];
  if (images && images.length > 0) {
    try {
      imageUrls = await Promise.all(
        images.map(async (image) => {
          const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}.jpg`;
          const filePath = path.join(__dirname, "../uploads", fileName);

          // Write the base64 data to a file in the "uploads" folder
          fs.writeFileSync(filePath, base64Data, "base64");

          // Return the path where the image is saved
          return `/uploads/${fileName}`;
        })
      );
    } catch (err) {
      console.error("Error saving base64 images:", err);
      return res.status(500).json({ error: "Failed to save images." });
    }
  }

  try {
    // Call the model to update mandir
    const result = await mandirModel.updateMandir(mandirId, {
      title,
      nickname,
      description,
      youtube_live_link,
      offline_video_morning,
      offline_video_evening,
      offline_video_night,
      aarti_time_morning,
      aarti_time_evening,
      aarti_time_night,
      map_link,
      images: imageUrls,
    });

    if (result === 0) {
      return res.status(404).json({ error: "Mandir not found." });
    }

    res.status(200).json({ message: "Mandir updated successfully." });
  } catch (err) {
    console.error("Error updating mandir:", err);
    res.status(500).json({ error: "Failed to update mandir." });
  }
};

const deleteMandir = async (req, res) => {
  const mandirId = req.params.id;

  try {
    const result = await mandirModel.deleteMandir(mandirId);

    if (result === 0) {
      return res.status(404).json({ error: "Mandir not found." });
    }

    res.status(200).json({ message: "Mandir deleted successfully." });
  } catch (err) {
    console.error("Error deleting mandir:", err);
    res.status(500).json({ error: "Failed to delete mandir." });
  }
};

module.exports = { addMandir, updateMandir, deleteMandir };
