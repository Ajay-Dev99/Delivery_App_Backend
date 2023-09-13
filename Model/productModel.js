const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    quantityInStock: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
    }

});

module.exports = new mongoose.model("Product", productSchema);;
