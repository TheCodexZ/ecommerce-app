const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");


const getDashboard = async(req,res)=>{
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            status: "Pending"
        });

        const processingOrders = await Order.countDocuments({
            status: "Processing"
        });

        const shippedOrders = await Order.countDocuments({
            status: "Shipped"
        });

        const deliveredOrders = await Order.countDocuments({
            status: "Delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            status: "Cancelled"
        });

        const lowStockProducts = await Product.countDocuments({
            stock: { $lte: 5 }
        });

        const revenue = await Order.aggregate([
            {
                $match: {
                    status: "Delivered",
                    isPaid: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        const totalRevenue =
        revenue.length > 0
            ? revenue[0].totalRevenue
            : 0;


        const recentOrders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5);


        return res.status(200).json({
            success: true,
            dashboard: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                pendingOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                lowStockProducts,
                recentOrders
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = { getDashboard };