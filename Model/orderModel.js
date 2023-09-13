const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
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
    },
    collectedAmount: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = new mongoose.model("order", orderSchema)