const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getActualites,
  getActualiteById,
  createActualite,
  updateActualite,
  deleteActualite,
} = require("../controllers/actualitesController");

// storage config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/actualites");
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Public
router.get("/", getActualites);
router.get("/:id", getActualiteById);

// Admin
router.post("/", upload.single("image"), createActualite);
router.put("/:id", upload.single("image"), updateActualite);
router.patch("/:id", updateActualite);
router.delete("/:id", deleteActualite);

module.exports = router;
