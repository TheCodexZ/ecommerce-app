const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields",
        });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
          success: false,
          message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });


    console.log(req.body);

    res.status(201).json({
    success: true,
    message: "User registered successfully",
      user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    console.log(req.body);

    if (!email || !password) {
      return res.status(400).json({
          success: false,
          message: "Please fill all the fields",
      });
    }
    


    //checking user exist or not
    const existingUser = await User.findOne({ email });

    if(!existingUser) {
      return res.status(401).json({
        success: false,
        message: "invalid email or password"
      });
    }

    //comparing password
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if(!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    const token = jwt.sign(
      {
        id: existingUser._id,      //this is payload
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    console.log(req.body);

    //Send cookie to browser
    res.cookie("token", token, {
      httpOnly: true,
    });

    //Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }

};


const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "logout done successfully",
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};