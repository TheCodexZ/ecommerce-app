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

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", ProductRoutes)

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;

