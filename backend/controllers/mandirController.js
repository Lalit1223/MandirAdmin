const mandirModel = require("../models/mandirModel"); // Import model

const { saveBase64File } = require("../config/saveBase64File");

// Add Mandir
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
    images, // expecting base64 images
  } = req.body;

  let imageUrls = [];
  if (images && images.length > 0) {
    try {
      imageUrls = images.map((image) =>
        saveBase64File(image, "uploads", "mandir")
      );
    } catch (err) {
      console.error("Error saving images:", err);
      return res.status(500).json({ error: "Failed to save images." });
    }
  }

  try {
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

    res.status(201).json({ message: "Mandir added successfully", mandirId });
  } catch (err) {
    console.error("Error adding mandir:", err);
    res.status(500).json({ error: "Failed to add mandir." });
  }
};

// Update Mandir
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
    images,
  } = req.body;

  let imageUrls = [];
  if (images && images.length > 0) {
    try {
      imageUrls = images.map((image) =>
        saveBase64File(image, "uploads", "mandir")
      );
    } catch (err) {
      console.error("Error saving images:", err);
      return res.status(500).json({ error: "Failed to save images." });
    }
  }

  try {
    const updated = await mandirModel.updateMandir(mandirId, {
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

    if (!updated) {
      return res.status(404).json({ error: "Mandir not found." });
    }

    res.status(200).json({ message: "Mandir updated successfully." });
  } catch (err) {
    console.error("Error updating mandir:", err);
    res.status(500).json({ error: "Failed to update mandir." });
  }
};

const getAllMandirs = async (req, res) => {
  try {
    const mandirs = await mandirModel.getAllMandirs();
    res.status(200).json(mandirs);
  } catch (err) {
    console.error("Error fetching mandirs:", err);
    res.status(500).json({ error: "Failed to fetch mandirs." });
  }
};

const getMandirById = async (req, res) => {
  const mandirId = req.params.id;

  try {
    const mandir = await mandirModel.getMandirById(mandirId);
    if (!mandir) {
      return res.status(404).json({ error: "Mandir not found." });
    }
    res.status(200).json(mandir);
  } catch (err) {
    console.error("Error fetching mandir:", err);
    res.status(500).json({ error: "Failed to fetch mandir." });
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

module.exports = {
  addMandir,
  updateMandir,
  deleteMandir,
  getAllMandirs,
  getMandirById,
};
