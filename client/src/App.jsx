import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/authSlice";
import API from "./services/axios";
import { setCart } from "./redux/cartSlice";



function App() {

  const dispatch = useDispatch();


  useEffect(() => {
    const checkLogin = async () => {

      try {
        const response = await API.get("/users/profile");
        dispatch(loginSuccess(response.data.user)); //to store data in the redux

        //fetch cart
        const cartResponse = await API.get("/cart");
        dispatch(setCart(cartResponse.data.cart));

      }
      catch (error) {
        console.log("User not logged in");
      }
    }

    checkLogin();
  }, []);




  return (
    <>
      <Navbar/>
      <AppRoutes/>
    </>
  )
}

export default App;