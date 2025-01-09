const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/avatars", express.static(path.join(__dirname, "avatars")));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: "./avatars",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
});

// Get all avatars
app.get("/api/avatars", (req, res) => {
  db.query("SELECT * FROM avatars", (err, results) => {
    if (err) {
      return res.status(500).send("Error fetching avatars.");
    }
    res.json(results);
  });
});

// Save user-selected avatar
app.post("/api/select-avatar", (req, res) => {
  const { userId, avatar } = req.body;
  db.query(
    "UPDATE users SET avatar = ? WHERE id = ?",
    [avatar, userId],
    (err) => {
      if (err) {
        return res.status(500).send("Error saving user avatar.");
      }
      res.status(200).send("Avatar selection saved successfully.");
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
