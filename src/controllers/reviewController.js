const Review = require("../models/Review");
const Product = require("../models/Product");
const mongoose = require("mongoose");


const addReview = async (req, res) => {   //it will called from productRoutes
    try {
        //product id
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Product is not valid"
            })
        }

        //product data
        const product = await Product.findById(id);

        
        //getting rating and comment from req.body
        const { rating, comment } = req.body;

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        //loggedIn userId
        const user = req.user.id;

        //checking if product exists
        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product does not exists"
            })
        }

        //checking if user already reviewed product
        const existingReview = await Review.findOne({
            user,
            product: id
        });

        if(existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        //creating review
        const review = await Review.create({
            user,
            product: id,
            rating,  //from user input
            comment  // form user input
        });


        //fetching reviews from Review model
        const reviews = await Review.find({
            product: id
        });


        //average reating
        let totalRating = 0;

        for(const review of reviews) {
            totalRating += review.rating;
        }

        const averageRating =
            Number((totalRating / reviews.length).toFixed(1));

        product.rating = averageRating;
        product.numReviews = reviews.length;

        await product.save();


        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            review
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};


const updateReview = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Id not valid"
            })
        }

        const review = await Review.findById(id);

        if(!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }

        const product  = await Product.findById(review.product); //because id is review id not product id (so we are taking it from review.product)
        
        if(!product) {
            return res.status(404).json({
                suceess: false,
                message: "Product not found"
            })
        }
        
        const user = req.user.id;


        if(review.user.toString() !== user) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this review"
            })
        }

        //taking updated rating and comment from user
        const { rating, comment } = req.body;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        //udpating review
        review.rating = rating;
        review.comment = comment;

        await review.save();


        //fetching all reviews from Review model
        const reviews = await Review.find({
            product: review.product
        })

        //total rating
        let totalRating = 0;

        for(const review of reviews) {
            totalRating += review.rating;
        }

        const averageRating = 
            Number((totalRating / reviews.length).toFixed(1));
        
        product.rating = averageRating;
        product.numReviews = reviews.length;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Review Updated successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:  error.message
        })
    }
}


const deleteReview = async (req, res) => {
    try {
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Id"
            })
        }

        const review = await Review.findById(id);

        if(!review) {
            return res.status(404).json({
                success: false,
                message: "review not found"
            })
        }

        const product = await Product.findById(review.product);

        if(!product) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            })
        }

        const user = req.user.id;

        if(review.user.toString() !== user) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this review"
            })
        }

        //delete review
        await Review.findByIdAndDelete(id);   
        //or await review.deleteOne()

        //fetching all reviews
        const reviews = await Review.find({
            product: review.product
        });


        if(reviews.length === 0) {
            product.rating = 0;
            product.numReviews = 0;

        } else {
            let totalRating = 0;

            for(const review of reviews) {
                totalRating += review.rating
            }

            const averageRating = Number((totalRating/reviews.length).toFixed(1));

            product.rating = averageRating;
            product.numReviews = reviews.length;
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getProductReviews = async (req, res) => {  //will called from productRoutes
    try {

        // Get Product ID
        const {id} = req.params;  //product id

        // Validate ObjectId
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id"
            })
        }

        const product = await Product.findById(id);

        // Check if product exists
        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        // Find all reviews of this product
        const reviews = await Review.find({
            product: id
        }).populate("user", "name");

        // Return response
        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addReview,
    updateReview,
    deleteReview,
    getProductReviews
}
 