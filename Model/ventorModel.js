const mongoose = require("mongoose")

const ventorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        buildingNo: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        }

    },
    phone_number: {
        type: Number,
        required: true
    }
})

module.exports = new mongoose.model("ventors", ventorSchema)