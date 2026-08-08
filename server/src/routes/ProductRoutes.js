const express = require("express");
const router = express.Router();

const { createProduct, getAllProduct, getSingleProduct, updateProduct, deleteProduct } = require("../controllers/ProductController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

//from reviewController
const {
    addReview,
    getProductReviews
} = require("../controllers/reviewController");



//admin routes
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

//public routes 
router.get("/", getAllProduct);
router.get("/:id", getSingleProduct);

//redirect to reviewController
router.post("/:id/review", protect, addReview);
router.get("/:id/reviews", getProductReviews);


module.exports = router;