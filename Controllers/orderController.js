const mongoose = require("mongoose");
const cartModel = require("../Model/cartModel");
const orderModel = require("../Model/orderModel")
const productModel = require("../Model/productModel")

const placeOrder = async (req, res, next) => {
    try {
        const cartId = req.params.id;

        if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(400).json({
                error: "Invalid cart id formate"
            })
        }
        const cart = await cartModel.findById(cartId)

        if (cart) {

            const products = cart.products

            for (const productItem of products) {
                const productId = productItem.productId;
                const quantity = parseInt(productItem.quantity);
                const productData = await productModel.findById(productId);

                if (productData) {
                    if (productData.quantityInStock >= quantity) {
                        // Update the quantityInStock and save the productData
                        productData.quantityInStock -= quantity;
                        await productData.save();
                    } else {
                        return res.status(400).json({
                            error: `Not enough stock for product with ID ${productId}.`
                        });
                    }
                } else {
                    return res.status(400).json({
                        error: `Product with ID ${productId} not found.`
                    })
                }
            }


            const newOrder = new orderModel({
                driverId: cart.driverId,
                ventorId: cart.ventorId,
                products: cart.products,
                totalAmount: cart.totalAmount,

            })
            await newOrder.save()
            await cartModel.findOneAndDelete({ _id: cartId })
            return res.status(200).json({
                message: "Order placed"
            })

        }
        res.status(400).json({
            message: "Cart Not Found"
        })
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const listOrders = async (req, res, next) => {
    try {
        const orders = await orderModel.find({})
            .populate({
                path: "driverId",
                select: "-password" // Exclude the 'password' field
            })
            .populate("ventorId")
            .populate("products.productId")

        res.status(200).json({
            orders: orders
        })
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

module.exports = {
    placeOrder,
    listOrders
}