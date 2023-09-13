const mongoose = require("mongoose")
const bcrypt = require("bcrypt")


const driverSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    phone_number: {
        type: Number,
        unique: true
    },
    address: {
        house: {
            type: String
        },
        street: {
            type: String
        },
        District: {
            type: String
        },
        pincode: {
            type: Number
        }

    },
    DrivingLiscence_No: {
        type: String
    },
    password: {
        type: String
    }
})

driverSchema.pre('save', async function (next) {
    const driver = this;
    // only hash the password if it has been modified (or is new)
    if (!driver.isModified('password')) return next();
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


module.exports = new mongoose.model("Driver", driverSchema)