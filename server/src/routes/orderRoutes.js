const express = require("express");
const router = express.Router();

const { placeOrder, getMyOrders, getSingleOrder, updateOrderStatus, getAllOrders, cancelOrder } = require("../controllers/OrderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");


router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);

router.get("/:id", protect, getSingleOrder);
router.put("/:id", protect, adminOnly, updateOrderStatus);
router.patch("/:id/cancel", protect, cancelOrder);

module.exports = router;


