const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
    },
    ventorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ventors",
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    }
})

module.exports = new mongoose.model("cart", cartSchema)