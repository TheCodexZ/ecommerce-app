import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/axios";

const Checkout = () => {

    const navigate = useNavigate();

    const [ shippingAddress, setShippingAddress ] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    })

    const [ paymentMethod, setPaymentMethod ] = useState("COD");
    const [ loading, setLoading ] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setShippingAddress((prev) => ({
            ...prev,
            [name] : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();    // let react handle it

        try {
            setLoading(true);

            const response = await API.post("/orders", {
                shippingAddress,
                paymentMethod,
            })

            console.log(response.data);

            alert("Order Placed Successfully");

            navigate("/orders");
        }
        catch (error) {
            console.log(error.response?.data);

            alert(
                error.response?.data?.message ||
                "Failed to place order"
            );
        }
        finally {
            setLoading(false);
        }
    }

    return (
            <div className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold mb-10">
                    Checkout
                </h1>

                <form onSubmit={handleSubmit}>

                    <div className="grid md:grid-cols-2 gap-10">

                        {/* Shipping Address */}
                        <div className="bg-white border rounded-xl p-6 shadow-sm">

                            <h2 className="text-2xl font-bold mb-6">
                                Shipping Address
                            </h2>

                            <div className="space-y-4">

                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={shippingAddress.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border p-3 rounded-lg"
                                />

                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={shippingAddress.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full border p-3 rounded-lg"
                                />

                                <textarea
                                    name="address"
                                    placeholder="Complete Address"
                                    value={shippingAddress.address}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full border p-3 rounded-lg"
                                />

                                <div className="grid grid-cols-2 gap-4">

                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={shippingAddress.city}
                                        onChange={handleChange}
                                        required
                                        className="border p-3 rounded-lg"
                                    />

                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={shippingAddress.state}
                                        onChange={handleChange}
                                        required
                                        className="border p-3 rounded-lg"
                                    />

                                </div>

                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="Pincode"
                                    value={shippingAddress.pincode}
                                    onChange={handleChange}
                                    required
                                    className="w-full border p-3 rounded-lg"
                                />

                            </div>
                        </div>


                        {/* Payment */}
                        <div className="bg-white border rounded-xl p-6 shadow-sm">

                            <h2 className="text-2xl font-bold mb-6">
                                Payment Method
                            </h2>

                            <div className="space-y-4">

                                <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer">

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod === "COD"}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            Cash on Delivery
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Pay when your order arrives
                                        </p>
                                    </div>

                                </label>


                                <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer">

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Online"
                                        checked={paymentMethod === "Online"}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            Online Payment
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Pay securely online
                                        </p>
                                    </div>

                                </label>

                            </div>


                            {/* Order Summary */}

                            <div className="border-t mt-8 pt-6">

                                <h2 className="text-xl font-bold mb-4">
                                    Order Summary
                                </h2>

                                <div className="flex justify-between text-lg font-semibold">
                                    <span>
                                        Payment
                                    </span>

                                    <span>
                                        {paymentMethod === "COD"
                                            ? "Cash on Delivery"
                                            : "Online Payment"
                                        }
                                    </span>
                                </div>

                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {loading
                                    ? "Placing Order..."
                                    : "Place Order"
                                }
                            </button>

                        </div>

                    </div>

                </form>

            </div>
        );
}

  

export default Checkout;