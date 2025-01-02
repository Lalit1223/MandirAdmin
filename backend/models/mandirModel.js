const pool = require("../config/db");

const addMandir = async (mandirData) => {
  const query = `
    INSERT INTO mandir (
      title, nickname, description, youtube_live_link,
      offline_video_morning, offline_video_evening, offline_video_night,
      aarti_time_morning, aarti_time_evening, aarti_time_night, map_link, images
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    mandirData.title,
    mandirData.nickname,
    mandirData.description,
    mandirData.youtube_live_link,
    mandirData.offline_video_morning,
    mandirData.offline_video_evening,
    mandirData.offline_video_night,
    mandirData.aarti_time_morning,
    mandirData.aarti_time_evening,
    mandirData.aarti_time_night,
    mandirData.map_link,
    JSON.stringify(mandirData.images), // Store image URLs as a JSON string
  ];

  try {
    const [result] = await pool.query(query, values);
    return result.insertId; // Returning insert ID for further use in controller
  } catch (err) {
    throw new Error("Failed to add mandir");
  }
};

const updateMandir = async (mandirId, mandirData) => {
  const query = `
    UPDATE mandir SET
      title = ?, 
      nickname = ?, 
      description = ?, 
      images = ?, 
      youtube_live_link = ?, 
      offline_video_morning = ?, 
      offline_video_evening = ?, 
      offline_video_night = ?, 
      aarti_time_morning = ?, 
      aarti_time_evening = ?, 
      aarti_time_night = ?, 
      map_link = ?
    WHERE id = ?
  `;

  const values = [
    mandirData.title,
    mandirData.nickname,
    mandirData.description,
    JSON.stringify(mandirData.images), // Store image URLs as a JSON string
    mandirData.youtube_live_link,
    mandirData.offline_video_morning,
    mandirData.offline_video_evening,
    mandirData.offline_video_night,
    mandirData.aarti_time_morning,
    mandirData.aarti_time_evening,
    mandirData.aarti_time_night,
    mandirData.map_link,
    mandirId,
  ];

  try {
    const [result] = await pool.query(query, values);
    return result.affectedRows;
  } catch (err) {
    throw new Error("Failed to update mandir");
  }
};

const deleteMandir = async (mandirId) => {
  const query = `DELETE FROM mandir WHERE id = ?`;

  try {
    const [result] = await pool.query(query, [mandirId]);
    return result.affectedRows;
  } catch (err) {
    throw new Error("Failed to delete mandir");
  }
};

module.exports = { addMandir, updateMandir, deleteMandir };
