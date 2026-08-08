import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import API from "../services/axios";
import { logout } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";

const Navbar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { totalItems } = useSelector((state) => state.cart);

    const { isAuthenticated, user } = useSelector(
        state => state.auth
    );

    //handle logout
    const handleLogout = async () => {

        try {

            await API.post("/auth/logout");

            dispatch(logout());
            dispatch(clearCart());

            navigate("/login");

        } catch (error) {
            console.log(error);
        }

    };

    return (

        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">


                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-blue-600"
                >
                    ShopEase
                </Link>


                {/* Center */}
                <div className="flex items-center gap-8 font-medium">

                    <Link to="/">Home</Link>
                    <Link to="/">Products</Link>

                </div>


                {/* Right */}
                <div className="flex items-center gap-5">

                    {
                        isAuthenticated ? (
                            <>

                                <Link
                                    to="/cart"
                                    className="relative">
                                    🛒 Cart

                                    {totalItems > 0 && (
                                        <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>

                                <Link to="/orders">
                                    Orders
                                </Link>

                                {
                                    user?.role === "admin" && (

                                        <Link to="/admin">
                                            Dashboard
                                        </Link>
                                    )
                                }

                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (

                            <>
                                <Link to="/login">
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Register
                                </Link>
                            </>

                        )
                    }
                </div>
            </div>
        </nav>
    );

};

export default Navbar;