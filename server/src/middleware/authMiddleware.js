const jwt = require("jsonwebtoken");


//creating middleware
const protect = async (req, res, next) => {
    try {

        //reading token from cookie
        const token = req.cookies.token;

        console.log(req.cookies);
        console.log(req.cookies.token);
        //checking if token exists
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login."
            });
        }

        //verify jwt
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        //declaring that user's req is verified  ex. "I'll store the logged-in user's information in req.user."
        req.user = decoded;

        //continue to next middleware
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};


//middleware2 => admingOnly

const adminOnly = async (req, res, next) => {
    const isAdmin = req.user.role;

    if(isAdmin !== "admin" ) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only.",
        });
    }

    next();
}



module.exports = { 
    protect,
    adminOnly
};



