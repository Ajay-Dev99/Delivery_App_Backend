const cartModel = require("../Model/cartModel")
const productModel = require("../Model/productModel")
const mongoose = require("mongoose")

const addToCart = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: "Bad request:Missing request data"
            })
        }

        const { products, driverId, ventorId } = req.body

        if (!products || !driverId || !ventorId) {
            return res.status(400).json({
                message: "Every fields are required"
            })
        }

        let totalAmount = 0;

        for (const productItem of products) {
            const productId = productItem.productId;
            const quantity = parseInt(productItem.quantity);
            const productData = await productModel.findById(productId);

            if (productData) {
                if (productData.quantityInStock < quantity) {
                    return res.status(400).json({
                        error: `${productData.name}'s limit exceeded.Only ${productData.quantityInStock} pieces are available`
                    })
                }
                const productPrice = productData.price;
                totalAmount += productPrice * quantity;
            } else {
                return res.status(400).json({
                    error: `Product with ID ${productId} not found.`
                })
            }
        }

        const newCart = new cartModel({
            driverId,
            ventorId,
            products,
            totalAmount
        })

        await newCart.save()
        return res.status(200).json({
            message: "Added to cart"
        })
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const listCart = async (req, res, next) => {
    try {
        const cart = await cartModel.find()
            .populate('driverId')
            .populate('ventorId')
            .populate('products.productId')
        res.status(200).json({ cart })

    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

//view cart of driver
const cartDetails = async (req, res, next) => {
    try {
        const driverId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(driverId)) {
            return res.status(400).json({
                error: "Invalid Driver Id Format"
            })
        }
        const cart = await cartModel.findOne({ driverId })
            .populate({
                path: "driverId",
                select: "-password" // Exclude the 'password' field
            })
            .populate('ventorId')
            .populate('products.productId')

        if (cart) {
            return res.status(200).json({
                cart: cart
            })
        }
        return res.status(400).json({
            message: "Cart not found"
        })
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}
module.exports = {
    addToCart,
    listCart,
    cartDetails
}