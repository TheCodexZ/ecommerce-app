const express = require("express");
const router = express.Router();

const {
    createPayment, verifyPayment 
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/create/:id", protect, createPayment);
router.post("/verify/:id", protect, verifyPayment)

module.exports = router;