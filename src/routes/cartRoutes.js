const express = require("express");
const router = express.Router();

const { addToCart, getMyCart, updateCart, deleteCart } = require("../controllers/CartController");
const { protect } = require("../middleware/authMiddleware");


//public routes
router.post("/",protect, addToCart);
router.put("/:id",protect, updateCart);
router.delete("/:id",protect, deleteCart);
router.get("/",protect, getMyCart);




module.exports = router;