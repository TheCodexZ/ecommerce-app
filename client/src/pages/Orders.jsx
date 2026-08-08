import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/axios";

const Orders = () => {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {

            const response = await API.get("/orders/my");

            setOrders(response.data.orders);

        } catch (error) {

            console.log("Error fetching orders:", error);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);


    // Loading
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <h2 className="text-2xl font-semibold">
                    Loading Orders...
                </h2>
            </div>
        );
    }


    return (
        <div className="max-w-7xl mx-auto px-6 py-10">

            <h1 className="text-4xl font-bold mb-10">
                My Orders
            </h1>


            {/* No Orders */}
            {orders.length === 0 ? (

                <div className="text-center py-20">

                    <h2 className="text-2xl font-semibold">
                        No Orders Yet
                    </h2>

                    <p className="text-gray-500 mt-3">
                        You haven't placed any orders yet.
                    </p>

                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Start Shopping
                    </button>

                </div>

            ) : (

                <div className="space-y-8">

                    {orders.map((order) => (

                        <div
                            key={order._id}
                            className="border rounded-xl shadow-sm bg-white p-6"
                        >

                            {/* Order Header */}
                            <div className="flex flex-col md:flex-row justify-between gap-4 border-b pb-5">

                                <div>

                                    <h2 className="font-bold text-lg">
                                        Order #{order._id.slice(-8)}
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1">
                                        Placed on{" "}
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>

                                </div>


                                {/* Status */}
                                <div>

                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-medium
                                            ${
                                                order.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : order.status === "Processing"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : order.status === "Shipped"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : order.status === "Delivered"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }
                                        `}
                                    >
                                        {order.status}
                                    </span>

                                </div>

                            </div>


                            {/* Products */}
                            <div className="py-6 space-y-5">

                                {order.items.map((item) => (

                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between gap-4"
                                    >

                                        {/* Product */}
                                        <div className="flex items-center gap-4">

                                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">

                                                {item.product?.image?.url ? (

                                                    <img
                                                        src={item.product.image.url}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />

                                                ) : (

                                                    <span className="text-gray-400 text-xs">
                                                        No Image
                                                    </span>

                                                )}

                                            </div>


                                            <div>

                                                <h3 className="font-semibold">
                                                    {item.product?.name || "Product unavailable"}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    Quantity: {item.quantity}
                                                </p>

                                            </div>

                                        </div>


                                        {/* Price */}
                                        <div className="font-semibold">

                                            ₹{item.price * item.quantity}

                                        </div>

                                    </div>

                                ))}

                            </div>


                            {/* Order Footer */}
                            <div className="border-t pt-5">

                                <div className="flex flex-col md:flex-row justify-between gap-5">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Payment Method
                                        </p>

                                        <p className="font-semibold">
                                            {order.paymentMethod}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Payment Status
                                        </p>

                                        <p
                                            className={`font-semibold ${
                                                order.isPaid
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {order.isPaid ? "Paid" : "Not Paid"}
                                        </p>

                                    </div>


                                    <div className="text-right">

                                        <p className="text-sm text-gray-500">
                                            Total Amount
                                        </p>

                                        <p className="text-2xl font-bold">
                                            ₹{order.totalAmount}
                                        </p>

                                    </div>

                                </div>


                                {/* View Details */}
                                <div className="mt-6">

                                    <button
                                        onClick={() =>
                                            navigate(`/orders/${order._id}`)
                                        }
                                        className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50"
                                    >
                                        View Details
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default Orders;