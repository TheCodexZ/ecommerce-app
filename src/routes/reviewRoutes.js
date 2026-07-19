const express = require("express");
const router = express.Router();

const {
    addReview,
    updateReview,
    deleteReview,
    getProductReviews
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// Product ID
router.post("/product/:id", protect, addReview);
router.get("/product/:id", getProductReviews);

// Review ID
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;