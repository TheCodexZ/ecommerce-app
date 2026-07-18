const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");




const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Import Routes
const authRoutes = require("./routes/authRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/UserRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/cart",  cartRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;

