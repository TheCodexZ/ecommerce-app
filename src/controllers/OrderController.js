const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const placeOrder = async (req, res) => {
    try {

        const user = req.user.id;
        const cartItems = await Cart.find({ user }).populate("product");

        if (cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        let totalAmount = 0;

        let orderItems = [];

        for (const item of cartItems) {


            if (!item.product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            if (item.quantity > item.product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `${item.product.name} is out of stock`
                });
            }

            totalAmount += item.product.price * item.quantity;

            orderItems.push({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            });
        }


        const order = await Order.create({
            user,
            items: orderItems,
            totalAmount
        });

        for(const item of cartItems) {
            item.product.stock -= item.quantity;
            await item.product.save();
        }

        await Cart.deleteMany({ user });

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

        

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



const getMyOrders = async (req, res) => {
    try {

        const user = req.user.id;

        const orders = await Order.find({ user })
            .populate("items.product", "name image price category");

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSingleOrder = async(req, res) => {
    try {

        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
           return res.status(400).json({
                success: false,
                message: "Invalid Product ID",
            });
        }  
        
        const user = req.user.id;
        
        const order = await Order.findById(id)
        .populate("items.product", "name image price category");;

        if(!order) {
            return res.status(404).json({
                success: false,
                message: "Order Not Found"
            })
        }

        if(order.user.toString() !== user) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this order"
            })
        }

        return res.status(200).json({
            success: true,
            order
        })


    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "name image price");

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Order ID"
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const validStatus = [
            "Pending",
            "Shipped",
            "Delivered"
        ];

        if (!validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        order.status = status;

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const cancelOrder = async (req, res) => {
    try {

        const { id } = req.params;

        const order = await Order.findById(id)
            .populate("items.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        if (order.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Order already cancelled"
            });
        }
        if (order.status === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "Delivered order cannot be cancelled"
            });
        }

        for (const item of order.items) {
            item.product.stock += item.quantity;
            await item.product.save();
        }

        order.status = "Cancelled";
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getSingleOrder,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
};