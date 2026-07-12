const Product = require("../models/Product");
const mongoose = require("mongoose");

const createProduct = async (req, res) => {
    try {
        const { name, 
                description, 
                price,
                category, 
                image, 
                stock} = req.body;

        if( !name || !description || !price || !category || 
            !image || !stock ) {
            return res.status(400).json({
                success: false,
                message: "plz fill all the field"
            });
        }
        const createdBy = req.user.id;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock,
            createdBy
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

const getAllProduct = async (req, res) => {
    try {

        let query = {};

        const { search, category, minPrice, maxPrice, sort } = req.query;

        if(search) {
            query.name = {
                $regex: search,
                $options: "i"
            };
        }

        //Category filter
        if(category) {
            query.category = category
        }

        //price filter
        if(minPrice || maxPrice) {
            query.price = {};

            if(minPrice) {
                query.price.$gte = Number(minPrice);
            }

            if(maxPrice) {
                query.price.$lte = Number(maxPrice);
            }
        }

        //default soring (newest first)
        let sortOption = {
            createdAt: -1,
        };

        // Custom Sorting
        if (sort === "price") {
            sortOption = { price: 1 };
        } else if (sort === "-price") {
            sortOption = { price: -1 };
        } else if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

        //fetching products
        const products = await Product.find(query).sort(sortOption);  //.sort => newest products appears first

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

const getSingleProduct = async (req, res) => {
    try {

        const { id } = req.params;

        //validate ObjectId
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID",
            });
        }

        //Find Product
        const product = await Product.findById(id);

        //Not found
        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        //Success
        return res.status(200).json({
            success: true,
            product
        }); 
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {

        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product Id"
            })
        };

        const product = await Product.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "updated successfully",
            product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Id"
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "product deleted successfully",
            product
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct
}