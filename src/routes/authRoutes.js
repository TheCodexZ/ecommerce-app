const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { createProduct, getAllProduct } = require("../controllers/ProductController")

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser )

router.get("/admin", protect, adminOnly, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome Admin!",
    });
});

router.post(
    "/", protect, adminOnly, createProduct
);

module.exports = router;

