import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PublicRoutes from "../components/PublicRoutes";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import OrderDetails from "../pages/OrderDetails";

function AppRoutes() {
    return (
        
            <Routes>

                <Route path="/" element={<Home/>} />

                <Route element={<PublicRoutes/>}>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register/>} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                    <Route path="/checkout" element={<Checkout />} />
                </Route>

                <Route path="/admin" element={<AdminRoute />}/>
                    
                <Route path="/products/:id" element={<ProductDetails/>}/>
                   

            </Routes>
        
    )
}

export default AppRoutes;