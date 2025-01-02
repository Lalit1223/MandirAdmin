const mysql = require("mysql2");

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const createMandirTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS mandir (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      nickname VARCHAR(255),
      description TEXT,
      youtube_live_link VARCHAR(255),
      offline_video_morning VARCHAR(255),
      offline_video_evening VARCHAR(255),
      offline_video_night VARCHAR(255),
      aarti_time_morning TIME,
      aarti_time_evening TIME,
      aarti_time_night TIME,
      map_link VARCHAR(255),
      images TEXT  -- This column will store the base64 image data or URLs as JSON string

    );
  `;
  try {
    await pool.promise().query(query);
  } catch (err) {
    console.error("Error creating mandir table:", err);
  }
};

// Automatically create the table on initialization
createMandirTable();

// Export the pool for querying the database
module.exports = pool.promise();
