const bcrypt = require('bcrypt')
const adminModel = require("../Model/adminModel")
const jwt = require("jsonwebtoken")
const maxAge = 3 * 24 * 60 * 60;

const createToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRETE_KEY, {
        expiresIn: maxAge
    })
}


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const admin = await adminModel.findOne({ email: email })
        if (admin) {
            const match = await bcrypt.compare(password, admin.password)
            if (match) {
                const token = await createToken(admin.email)
                return res.status(200).json({ message: "Login Succesfull", token: token })
            } else {
                return res.status(401).json({ error: "Unauthorized: Incorrect password" })
            }
        } else {
            return res.status(401).json({ error: "Unauthorized:Email not found" })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internel Server error"
        })
    }
}




module.exports = {
    login
}



