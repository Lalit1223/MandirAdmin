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
    status = 0, // Default to 0
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
      status,
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
    images, // Expecting base64 images or existing paths
  } = req.body;

  let imageUrls = [];
  try {
    if (images && images.length > 0) {
      imageUrls = images.map((image) => {
        if (image.startsWith("data:image")) {
          // Save new Base64 image
          return saveBase64File(image, "uploads", "mandir");
        } else {
          // Retain existing image path
          return image;
        }
      });
    } else {
      // Retain existing images if no new ones are provided
      const existingMandir = await mandirModel.getMandirById(mandirId);
      if (!existingMandir) {
        return res.status(404).json({ error: "Mandir not found." });
      }
      imageUrls = existingMandir.images;
    }
  } catch (err) {
    console.error("Error processing images:", err);
    return res.status(500).json({ error: "Failed to process images." });
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

const updateMandirStatus = async (req, res) => {
  const mandirId = req.params.id;
  const { status } = req.body;

  if (typeof status !== "number") {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const updated = await mandirModel.updateMandirStatus(mandirId, status);

    if (!updated) {
      return res.status(404).json({ error: "Mandir not found" });
    }

    res.status(200).json({ message: "Mandir status updated successfully" });
  } catch (err) {
    console.error("Error updating mandir status:", err);
    res.status(500).json({ error: "Failed to update mandir status" });
  }
};

const getMandirCount = async (req, res) => {
  try {
    const count = await mandirModel.getMandirCount();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching Mandir count:", error);
    res.status(500).json({ error: "Failed to fetch Mandir count." });
  }
};

module.exports = {
  addMandir,
  updateMandir,
  deleteMandir,
  getAllMandirs,
  getMandirById,
  updateMandirStatus,
  getMandirCount,
};
