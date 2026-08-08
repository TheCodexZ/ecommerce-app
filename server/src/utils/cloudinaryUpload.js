const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

const uploadImage = (fileBuffer) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "ecommerce-products"
            },
            (error, result) => {

                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);

    });

};

module.exports = uploadImage;