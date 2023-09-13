const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const maxAge = 3 * 24 * 60 * 60;
const driverModel = require("../Model/truckDriverModel")


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRETE_KEY, {
        expiresIn: maxAge
    })
}


// Driver Login

const driverLogin = async (req, res, next) => {
    try {
        const { phone_number, password } = req.body
        const driver = await driverModel.findOne({ phone_number })

        if (!driver) {
            return res.status(400).json({
                message: "Driver Not found"
            })
        }
        const match = await bcrypt.compare(password, driver.password)
        if (!match) {
            return res.status(400).json({
                message: "Password Error"
            })
        }

        const token = await createToken(driver._id)
        res.status(200).json({
            message: "Login Success",
            token: token
        })
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

//Add Driver

const addDriver = async (req, res, next) => {
    try {
        const phone_number = req.body.phone_number
        const alreadyExist = await driverModel.findOne({ phone_number })
        if (alreadyExist) {
            return res.status(400).json({
                message: "Phone number Already exist"
            })
        } else {
            const { name, phone_number, house, street, District, pincode, DrivingLiscence_No, password } = req.body
            const address = {
                house, street, District, pincode
            }
            const newDriver = new driverModel({
                name, name, phone_number, address, DrivingLiscence_No, password
            })
            await newDriver.save()
        }
        res.status(200).json({
            message: "Driver added"
        })
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message || "Internal Server Error"
        })
    }

}

//List all drivers

const listDrivers = async (req, res, next) => {
    try {
        const drivers = await driverModel.find({}, { password: 0, __v: 0 })
        res.status(200).json({
            drivers: drivers
        })
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error" })
    }
}

//Individual data

const driverData = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid driver ID format"
            });
        }
        const id = req.params.id
        const data = await driverModel.findOne({ _id: id }).select('-password');
        if (!data) {
            return res.status(400).json({
                message: "Driver not found"
            })
        }
        res.status(200).json({
            driverData: data
        })

    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

//edit driver

const editDriver = async (req, res, next) => {
    try {
        const driverId = req.params.id;
        // Updated driver details from the request body
        const { name, phone_number, house, street, District, pincode, DrivingLiscence_No } = req.body
        const address = {
            house, street, District, pincode
        }
        const updatedDriverData = {
            name, name, phone_number, address, DrivingLiscence_No
        }

        // ID validation and handling
        if (!mongoose.Types.ObjectId.isValid(driverId)) {
            return res.status(400).json({ message: 'Invalid driver ID format' });
        }

        const driverToUpdate = await driverModel.findOne({ _id: driverId })

        //Phone-number unique in schema so check that new number is already exist or not

        if (updatedDriverData.phone_number && parseInt(updatedDriverData.phone_number) != driverToUpdate.phone_number) {
            const existingDriverWithPhoneNumber = await driverModel.findOne({ phone_number: updatedDriverData.phone_number });
            if (existingDriverWithPhoneNumber) {
                return res.status(400).json({ message: 'Phone number already exists for another Driver' });
            }
        }

        // Find the driver by ID and update their details
        const updatedDriver = await driverModel.findByIdAndUpdate(driverId, updatedDriverData, {
            new: true,
            runValidators: true,
        });

        if (!updatedDriver) {
            return res.status(404).json({ message: 'driver not found' });
        }

        res.status(200).json({ message: 'driver details updated', driver: updatedDriver });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
    }
};


//Delete Driver

const deleteDriver = async (req, res, next) => {
    try {
        // ID validation and handling
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid driver ID format' });
        }

        const id = req.params.id
        const result = await driverModel.findOneAndDelete({ _id: id })

        if (result) {
            return res.status(200).json({
                message: "Driver Deleted"
            })

        } else {
            return res.status(404).json({
                message: "Driver not found"
            });
        }


    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

module.exports = {
    addDriver,
    listDrivers,
    driverData,
    editDriver,
    deleteDriver,
    driverLogin
}