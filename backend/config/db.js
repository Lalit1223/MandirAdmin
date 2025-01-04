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

const createEventTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS  events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  description TEXT NOT NULL,
  link VARCHAR(255),
  banner_image VARCHAR(255) NOT NULL
);
  `;
  try {
    await pool.promise().query(query);
  } catch (err) {
    console.error("Error creating event table:", err);
  }
};

const createBookTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      cover_image VARCHAR(255), -- Path to the cover image
      pdf_file VARCHAR(255) -- Path to the PDF file
    );
  `;
  try {
    await pool.promise().query(query);
  } catch (err) {
    console.error("Error creating books table:", err);
  }
};

// Add to the initialization block
(async () => {
  await createMandirTable();
  await createEventTable();
  await createBookTable(); // Call the book table creation function
})();
// Export the pool for querying the database
module.exports = pool.promise();
