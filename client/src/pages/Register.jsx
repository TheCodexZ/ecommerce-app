import { useState } from "react";
import API from "../services/axios"
import { useNavigate } from "react-router-dom";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            
            await API.post("/auth/register", {
                name,
                email,
                password,
            });

            navigate("/login");
        } catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    //return
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">

                <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

                <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-3 rounded mb-4" />

                <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-3 rounded mb-6" />

                <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-3 rounded mb-6" />

                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">Register</button>

                <p className="text-center mt-4">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-600 cursor-pointer"
                    >
                        Login
                    </span>
                </p>

            </form>
        </div>
    )
  
}

export default Register;