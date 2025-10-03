// backend/routes/dashboard.js
const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Route protégée du dashboard
router.get("/", verifyToken, (req, res) => {
  res.json({
    message: "Bienvenue sur le Dashboard 🚀",
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

module.exports = router;
