const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "root", // Replace with your MySQL password
  database: "mandir_app",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to the database.");
  }
});

module.exports = db;
