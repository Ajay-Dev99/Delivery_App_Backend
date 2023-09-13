const jwt = require('jsonwebtoken')
const driverModel = require('../../Model/truckDriverModel');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(400).json({ AccessStatus: false, message: "Authentication token is missing." })
        } else {
            const authtoken = authHeader.replace(/^Bearer\s+/i, '');
            //if there is no token
            if (!authtoken) return res.status(400).json({ AccessStatus: false, message: "Invalid token format." })

            //decoding the token
            const decoded = jwt.verify(authtoken, process.env.JWT_SECRETE_KEY)
            //checking whether user exist or not
            const driver = await driverModel.findOne({ _id: decoded.id })
            if (!driver) return res.status(400).json({ AccessStatus: false, message: "Unauthorized access. driver not found." })
            req.driver = driver
            next()
        }

    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || "Unauthorized" })
    }
}