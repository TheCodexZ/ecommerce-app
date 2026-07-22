const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getMyProfile = async (req, res) => {
    try {

        const user = req.user.id;
                                                     //minus sign means return everything except password
        const verifyUser = await User.findById(user).select("-password");

        if(!verifyUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            user: verifyUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = req.user.id;

        const { name, email } = req.body;

        const updateData = {};

        if(name) {
            updateData.name = name;
        }
        if(email) {
            updateData.email = email;
        }

        const updatedUser = await User.findByIdAndUpdate(
            user, 
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            success: true,
            message: error.message
        })
    }
};


const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if(!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please Enter old and new password!"
            })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }
        
        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from old password"
            });
        }

        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Please enter the correct password"
            })
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    getMyProfile,
    updateProfile,
    changePassword
}