const { default: mongoose } = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
    try {
        const { product, quantity = 1 } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }

        const user = req.user.id;

        const productData = await Product.findById(product);

        if(!productData) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        };

        const existingCartItem = await Cart.findOne({
            user,
            product
        });

        if(existingCartItem) {

            if(existingCartItem.quantity + quantity > productData.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Only items " + productData.stock +" Available in stock "
                })
            }


            existingCartItem.quantity += quantity;

            await existingCartItem.save();

            return res.status(200).json({
                success: true,
                message: "Cart Updated successfully",
                cart: existingCartItem
            })
        }
        else {
            if(quantity > productData.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Only items " + productData.stock + " items available in stock"
                });
            }

            const cart = await Cart.create({
                user,
                product,
                quantity
            });

            return res.status(201).json({
                success: true,
                message: "Product added to cart",
                cart
            });
        }


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

const getMyCart = async (req, res) => {
    try {

        const user = req.user.id;

        const cart = await Cart.find({ user })
            .populate("product");     //product is field name in the cartSchema which ref: Product
                                        //with populate we get more info about product instead of only user id and product id and quantity
        return res.status(200).json({
            success: true,
            count: cart.length,
            cart,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateCart = async (req, res) =>{
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        //product id validation
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Cart Id"
            })
        }

        const cart = await Cart.findById(id);

        if(!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            })
        }

        //cheking cart userID is same as req.user.id or not
        if (cart.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this cart"
            });
        }


        const product = await Product.findById(cart.product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if(quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        if(quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Only " + product.stock + " items available in stock"
            })
        }

        cart.quantity = quantity;
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteCart = async (req, res) => {
    try {
        const { id } = req.params;

        //product id validation
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Cart Id"
            })
        }

        const cart = await Cart.findById(id);

        if(!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            })
        }

        //cheking cart userID is same as req.user.id or not
        if (cart.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this cart"
            });
        }

        await cart.deleteOne();
        // or => await Cart.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Cart item removed successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    addToCart,
    getMyCart,
    updateCart,
    deleteCart
}