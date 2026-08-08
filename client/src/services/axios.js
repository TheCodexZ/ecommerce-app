import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,        //without withCredentials browser will not send the cookie to your backend
})

export default API;

