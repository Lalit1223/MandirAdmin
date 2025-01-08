const pool = require("../config/db");

const addMandir = async (mandirData) => {
  const query = `
    INSERT INTO mandir (
      title, nickname, description, youtube_live_link,
      offline_video_morning, offline_video_evening, offline_video_night,
      aarti_time_morning, aarti_time_evening, aarti_time_night, map_link, images,status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
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
    mandirData.status || 0, // Default to 0 if not provided
  ];

  try {
    const [result] = await pool.query(query, values);
    return result.insertId; // Returning insert ID for further use in controller
  } catch (err) {
    throw new Error("Failed to add mandir");
  }
};

const getAllMandirs = async () => {
  const query = `SELECT * FROM mandir`;

  try {
    const [rows] = await pool.query(query);
    return rows.map((mandir) => ({
      ...mandir,
      images: JSON.parse(mandir.images), // Parse images JSON string
    }));
  } catch (err) {
    throw new Error("Failed to fetch mandirs");
  }
};

const getMandirById = async (mandirId) => {
  const query = `SELECT * FROM mandir WHERE id = ?`;

  try {
    const [rows] = await pool.query(query, [mandirId]);
    if (rows.length === 0) return null;

    const mandir = rows[0];
    return {
      ...mandir,
      images: JSON.parse(mandir.images), // Parse images JSON string
    };
  } catch (err) {
    throw new Error("Failed to fetch mandir");
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
      map_link = ?,
      status = ?

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
    mandirData.status,
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

const updateMandirStatus = async (mandirId, status) => {
  const query = `UPDATE mandir SET status = ? WHERE id = ?`;

  try {
    const [result] = await pool.query(query, [status, mandirId]);
    return result.affectedRows;
  } catch (err) {
    throw new Error("Failed to update mandir status");
  }
};

const getMandirCount = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM mandir");
  return rows[0].count;
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
