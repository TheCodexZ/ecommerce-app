const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { getMyProfile, updateProfile, changePassword } = require("../controllers/UserController");

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;