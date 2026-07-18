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

        status: {
            type: String,
            enum: ["Pending", "Shipped", "Deliverd", "Cancelled"],
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Order", orderSchema);
