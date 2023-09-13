const mongoose = require("mongoose")


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
    return /^[0-9]{10}$/.test(phoneNumber);
}

function isValidPincode(pincode) {
    return /^[0-9]{6}$/.test(pincode);
}

function isValidName(name) {
    const nameRegex = /^[a-zA-Z]{3,}$/;
    return nameRegex.test(name);
}

function isValidPassword(password) {
    // Password must contain at least one capital letter and one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])/;
    return passwordRegex.test(password);
}

function isValidProductName(value) {
    const nameRegex = /^[A-Za-z0-9\s]{3,}$/;
    return nameRegex.test(value);
}

const driverLoginValidation = (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Bad request:Missing request data"
        })
    }

    if (!req.body.phone_number || !isValidPhoneNumber(req.body.phone_number)) {
        return res.status(400).json({
            error: "Invalid phone Number"
        })
    }
    if (!req.body.password) {
        return res.status(400).json({
            error: "Password required"
        })
    }
    next()
}

const adminLoginValidation = (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Bad Request: Missing request data" });
        } else {
            const { email, password } = req.body;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            } else if (!isValidEmail(email)) {
                return res.status(400).json({ error: 'Invalid email address' });
            } else if (!password) {
                return res.status(400).json({ error: 'Password is required' });
            }
            next()
        }
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internel Server error"
        })
    }

}

const addDriverValidaton = (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Bad Request: Missing request data" });
        }
        if (Object.keys(req.body).length !== 9) {
            return res.status(400).json({ error: "All Feilds are required" })
        }
        if (!isValidName(req.body.name)) {
            return res.status(400).json({ error: "Invalid name. Name must be at least 3 letters long and contain only letters (no special characters or white spaces)." })
        }
        if (!isValidPhoneNumber(req.body.phone_number)) {
            return res.status(400).json({ error: "Invalid phone number" });
        }

        if (!req.body.pincode || !isValidPincode(req.body.pincode)) {
            return res.status(400).json({ error: "Invalid pincode" });
        }

        if (!isValidPassword(req.body.password)) {
            return res.status(400).json({ error: "Invalid password. Password must be contain at least one capital letter and one special character." })
        }
        if (req.body.password.length < 5) {
            return res.status(400).json({ error: "Invalid password. Password must be at least 5 characters long." })
        }
        if (req.body.password !== req.body.confirm_password) {
            return res.status(400).json({ error: "Passwords do not match" })
        }
        if (!req.body.house) {
            return res.status(400).json({ error: "House is required" });
        }
        if (!req.body.street) {
            return res.status(400).json({ error: "Street is required" });
        }
        if (!req.body.District) {
            return res.status(400).json({ error: "District is required" });
        }
        if (!req.body.DrivingLiscence_No) {
            return res.status(400).json({ error: "DrivingLiscence_No is required" });

        }

        next()
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message || "Internal Server Error"
        })
    }
}

const editDriverValidaton = (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Bad Request: Missing request data" });
        }

        if (Object.keys(req.body).length < 7) {
            return res.status(400).json({ error: "All Feilds are required" })
        }

        if (!isValidName(req.body.name)) {
            return res.status(400).json({ error: "Invalid name. Name must be at least 3 letters long and contain only letters (no special characters or white spaces)." })
        }
        if (!isValidPhoneNumber(req.body.phone_number)) {
            return res.status(400).json({ error: "Invalid phone number" });
        }

        if (!req.body.pincode || !isValidPincode(req.body.pincode)) {
            return res.status(400).json({ error: "Invalid pincode" });
        }
        if (!req.body.house) {
            return res.status(400).json({ error: "House is required" });
        }
        if (!req.body.street) {
            return res.status(400).json({ error: "Street is required" });
        }
        if (!req.body.District) {
            return res.status(400).json({ error: "District is required" });
        }
        if (!req.body.DrivingLiscence_No) {
            return res.status(400).json({ error: "DrivingLiscence_No is required" });

        }
        next()
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message || "Internal Server Error"
        })
    }
}

const addVentorValidation = (req, res, next) => {
    try {

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Bad Request: Missing request data" });
        }
        if (Object.keys(req.body).length < 7) {
            return res.status(400).json({ error: "All Feilds are required" })
        }
        if (!isValidName(req.body.name) || !req.body.name) {
            return res.status(400).json({ error: "Invalid name. Name must be at least 3 letters long and contain only letters (no special characters or white spaces)." })
        }
        if (!isValidPhoneNumber(req.body.phone_number) || !req.body.phone_number) {
            return res.status(400).json({ error: "Invalid phone number" });
        }


        if (!isValidEmail(req.body.email) || !req.body.email) {
            return res.status(400).json({ error: 'Invalid email address' });
        }
        if (!req.body.buildingNo) {
            return res.status(400).json({ error: "BuildingNo is required" });
        }
        if (!req.body.street) {
            return res.status(400).json({ error: "Street is required" });
        }

        if (!req.body.district) {
            return res.status(400).json({ error: "District is required" });
        }
        if (!req.body.pincode || !isValidPincode(req.body.pincode)) {
            return res.status(400).json({ error: "Invalid pincode" });
        }

        next()



    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const addCategoryValidtion = (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Bad Request: Missing request data" });
    }
    if (!isValidName(req.body.name)) {
        return res.status(400).json({ error: "Invalid name. Name must be at least 3 letters long and contain only letters (no special characters or white spaces)." })
    }
    next()

}

const addProductValidation = (req, res, next) => {

    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Bad Request: Missing request data" });
        }
        // if (Object.keys(req.body).length < 4) {
        //     return res.status(400).json({ error: "All Feilds are required" })
        // }
        if (!req.body.name || !isValidProductName(req.body.name)) {
            return res.status(400).json({ error: "Invalid name. Name must be at least 3 letters long and contain only letters (no special characters or white spaces)." })
        }
        if (!req.body.price || isNaN(req.body.price)) {
            return res.status(400).json({ error: "Invalid Price" })
        }
        if (!req.body.category || !mongoose.Types.ObjectId.isValid(req.body.category)) {
            return res.status(400).json({ error: "Invalid Category Id" })
        }
        if (!req.body.quantityInStock || isNaN(req.body.quantityInStock)) {
            res.status(400).json({
                error: "Invalid stock number"
            })
        }

        next()

    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}


module.exports = {
    adminLoginValidation,
    addDriverValidaton,
    editDriverValidaton,
    addVentorValidation,
    addCategoryValidtion,
    addProductValidation,
    driverLoginValidation
}