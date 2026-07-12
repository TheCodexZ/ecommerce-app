const express = require("express");
const router = express.Router();

const { createProduct, getAllProduct, getSingleProduct, updateProduct, deleteProduct } = require("../controllers/ProductController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

//admin routes
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

//public routes 
router.get("/", getAllProduct);
router.get("/:id", getSingleProduct);


module.exports = router;