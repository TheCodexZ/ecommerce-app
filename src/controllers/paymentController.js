const Order = require("../models/Order");
const mongoose = require("mongoose");
const crypto = require("crypto");

const createPayment = async (req, res) => {
    try {

        const { id } = req.params;

        //valided Order ID
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Order ID"
            });
        }

        const order = await Order.findById(id);

        if(!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        //check owner of order
        if(order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not Authorized"
            });
        }

        // Already paid
        if(order.isPaid) {
            return res.status(400).json({
                success: false,
                message: "Order is already paid"
            });
        }

        //Generate fake transaction ID
        const transactionId = "TXN-" + crypto.randomBytes(8).toString("hex");

        return res.status(200).json({
            success: true,
            message: "Proceed to payment",
            transactionId,
            amount: order.totalAmount
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { id } = req.parms;
        const { transactionId } = req.body

        //Validate Order id
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Order ID"
            })
        }

        const order = await Order.findById(id);

        if(!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        //check owner
        if(order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            })
        }

        if(order.isPaid) {
            return res.status(400).json({
                success: false,
                message: "Order already paid"
            })
        }

        order.isPaid = true;
        order.transactionId = transactionId;
        order.paidAt = new Date();

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment successful",
            order
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createPayment,
    verifyPayment
}