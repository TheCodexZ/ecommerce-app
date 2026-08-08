//why we use multer?
/*
express can easily read: req.body.name , req.body.pric

But cannot understand iphone.jpg because it is a file not JSON
Multer extracts the uploaded file and make it available as: req.file                   
 */

const multer = require("multer");

//create storage (memory RAM)
const storage = multer.memoryStorage();

// Allow only image files
const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {
        cb(null, true);   // Accept file
    } else {
        cb(new Error("Only image files are allowed"), false); // Reject file
    }

};

// Create upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

module.exports = upload;