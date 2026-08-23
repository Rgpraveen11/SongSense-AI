const ACRCloud = require("acrcloud");
require("dotenv").config();

const acr = new ACRCloud({
  host: process.env.ACR_HOST,
  access_key: process.env.ACR_ACCESS_KEY,
  access_secret: process.env.ACR_SECRET_KEY,
});

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

app.get("/", (req, res) => {
  res.json({
    message: "SongSense AI Backend is running 🎵",
  });
});

// Upload audio
app.post("/api/upload", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an audio file.",
    });
  }

  res.json({
    success: true,
    message: "Audio uploaded successfully 🎵",
    file: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: req.file.path,
    },
  });
});

// Identify song
app.post("/api/identify", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an audio file.",
    });
  }

  try {
    const audioBuffer = fs.readFileSync(req.file.path);

    const metadata = await acr.identify(audioBuffer);

    console.log("ACRCloud RESPONSE:");
    console.log(JSON.stringify(metadata, null, 2));

    if (!metadata || !metadata.metadata) {
      return res.json({
        success: false,
        message: "Sorry, we couldn't identify this song.",
      });
    }

    const music = metadata.metadata.music?.[0];

    if (!music) {
      return res.json({
        success: false,
        message: "Sorry, we couldn't identify this song.",
      });
    }

    return res.json({
      success: true,
      message: "Song identified successfully 🎵",
      song: {
        title: music.title || "Unknown",
        artist: music.artists?.[0]?.name || "Unknown",
        album: music.album?.name || "Unknown",
        releaseDate: music.release_date || null,
       songLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(
  `${music.title} ${music.artists?.[0]?.name || ""}`
)}`,
      },
    });

  } catch (error) {
    console.error(
      "ACRCloud Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Song identification failed.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🎵 SongSense AI server running on port ${PORT}`);
});