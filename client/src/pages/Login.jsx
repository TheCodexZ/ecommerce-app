import { useState } from "react";
import API from "../services/axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { setCart } from "../redux/cartSlice";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from || "/";


    //Redux
    const dispatch = useDispatch();    //to send/save data in redux
    const user = useSelector((state) => state.auth.user);   //to read data from redux

    console.log("Redux user: ", user);



    //form submit
    const handleSubmit = async (e) => {
        try {
            e.preventDefault(); //prevents to submit form automatically by the browser (let react code handle it)
            
            const response = await API.post("/auth/login", {
                email,
                password
            });


            console.log(response.data);

            dispatch(loginSuccess(response.data.user)); //saving data into redux 

            //fetch cart
            const cartResponse = await API.get("/cart");
            dispatch(setCart(cartResponse.data.cart));
            navigate(from, {replace: true});


            console.log("Navigating to:", from);
            navigate(from, { replace: true });

            console.log("From =", from);

        } catch (error) {
            console.log("Login error: " + error.response?.data?.message);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
           
            <form onSubmit={handleSubmit} 
                className="bg-white p-8 rounded-lg shadow-lg w-96">
                
                <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
                
                <input 
                    type="email" 
                    placeholder="Enter Email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full border p-3 rounded mb-4" 
                />

                <input 
                    type="password" 
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-3 rounded mb-6" 
                />

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                    >
                    Login
                </button>

                <p className="text-center mt-4">
                    Don't have an account?{" "}
                    <span
                        onClick={() => 
                            navigate("/register",{
                                state: { from }
                            }
                        )}
                        
                        className="text-blue-600 cursor-pointer"
                    >
                        Register
                    </span>
                </p>


            </form>
        </div>
    )
}

export default Login;