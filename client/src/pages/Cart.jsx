import { useState, useEffect } from "react";
import API from "../services/axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);


    const fetchCart = async () => {
        try {
            
            const response = await API.get("/cart");
            setCartItems(response.data.cart);

        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false);
        }
    }

    //update item quantity
    const updateQuantity = async (cartId, quantity) => {
        try {

            await API.put(`/cart/${cartId}`, {
                quantity,
            });

            fetchCart();

        } catch (error) {
            console.log(error.response?.data?.message);
            alert(error.response?.data?.message);
        }
    };

    //Remove item from cart
    const removeItem = async (cartId) => {

        try {

            await API.delete(`/cart/${cartId}`);

            fetchCart();

        } catch (error) {
            console.log(error);
        }
    };


    if(loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading Cart...
            </div>
        )
    }

    //Calculating total
    const totalProducts = cartItems.length;

    const totalItems = cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    const totalPrice = cartItems.reduce(
        (acc, item) =>
            acc + item.product.price * item.quantity,
        0
    );

    const deliveryCharge = totalPrice > 1000 ? 0 : 100;
    const grandTotal = totalPrice + deliveryCharge;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">


        
            <h1 className="text-4xl font-bold mb-10">
                Shopping Cart
            </h1>

            {
                cartItems.length === 0 ? (
                    <div className="text-center mt-20">

                        <h1 className="text-3xl font-bold">
                            Your Cart is Empty
                        </h1>

                        <p className="text-gray-500 mt-3">
                            Add some products to continue shopping.
                        </p>

                    </div>

                ) : (

                    
                    <div className="grid lg:grid-cols-3 gap-8">
                        
                        {/* Cart items starts */}
                        <div className="lg:col-span-2">
                            <div className="space-y-6">
                                {
                                    cartItems.map((item) => (
                                        <div key={item._id}
                                            className="flex items-center justify-between border rounded-xl p-5 shadow"
                                        >


                                            <div className="flex items-center gap-6">

                                                <img src={item.product?.image?.url || "/placehold-product.png"} 
                                                    alt={item.product.name || "Product"}
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/placeholder-product.png"
                                                    }}
                                                    className="w-28 h-28 object-cover rounded" 
                                                />


                                                <div>
                                                    <h2 className="text-xl font-semibold">{item.product.name}</h2>
                                                    <p className="text-gray-500">{item.product.price}</p>
                                                    <div className="flex items-center gap-3 mt-3">

                                                        <button
                                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                            disabled={item.quantity === 1}
                                                            className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
                                                        >
                                                            -
                                                        </button>

                                                        <span className="font-bold">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                            className="bg-gray-200 px-3 py-1 rounded"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                </div>

                                            </div>

                                            <div className="text-right">

                                                <h2 className="text-2xl font-bold text-green-600">
                                                    ₹{item.product.price * item.quantity}
                                                </h2>

                                                <button
                                                    onClick={() => removeItem(item._id)}
                                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        {/* Cart items ends */}

                        {/* Summary starts */}
                            <div className="sticky top-24">

                                <div className="border rounded-xl shadow-lg p-6">

                                    <h2 className="text-2xl font-bold mb-6">
                                        Cart Summary
                                    </h2>

                                    <div className="space-y-4">


                                        <div className="flex justify-between">
                                            <span>Products</span>
                                            <span>{totalProducts}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Items</span>
                                            <span>{totalItems}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Total Price</span>
                                            <span>₹{totalPrice.toLocaleString()}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Delivery</span>

                                            {
                                                deliveryCharge === 0 ? (
                                                    <span className="text-green-600 font-semibold">
                                                        FREE
                                                    </span>
                                                ) : (
                                                    <span>
                                                        ₹{deliveryCharge}
                                                    </span>
                                                )
                                            }

                                        </div>

                                        <hr />

                                        <div className="flex justify-between text-xl font-bold">

                                            <span>Grand Total</span>

                                            <span className="text-green-600">
                                                ₹{grandTotal.toLocaleString()}
                                            </span>

                                        </div>
                                    </div>

                                    {
                                        deliveryCharge === 0 && (
                                            <p className="text-green-600 text-sm mt-4 text-center">
                                                🎉 Congratulations! You have unlocked FREE Delivery.
                                            </p>
                                        )
                                    }

                                    <button
                                        onClick={() => navigate("/checkout")}
                                        className="w-full mt-8 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                                    >
                                        Proceed to Checkout
                                    </button>

                                </div>

                            </div>
                        {/* Summary ends */}
                        
                    </div>
                    
                )
            }
        </div>
    );
};

export default Cart;