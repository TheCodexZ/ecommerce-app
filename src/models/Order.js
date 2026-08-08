const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                },

                price: {
                    type: Number,
                    required: true,
                },
            }
        ],

        totalAmount: {
            type: Number,
            required: true,
        },

        // Shipping information
        shippingAddress: {
            fullName: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            address: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            state: {
                type: String,
                required: true,
            },

            pincode: {
                type: String,
                required: true,
            },
        },

        // Payment information
        paymentMethod: {
            type: String,
            enum: ["COD", "Online"],
            default: "COD",
        },

        isPaid: {
            type: Boolean,
            default: false,
        },

        transactionId: {
            type: String,
            default: null,
        },

        paidAt: {
            type: Date,
            default: null,
        },

        // Order status
        status: {
            type: String,
            enum: [
                "Pending",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);