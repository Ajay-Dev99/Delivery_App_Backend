const jwt = require('jsonwebtoken')
const AdminModel = require('../../Model/adminModel');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.json({ AccessStatus: false, message: "Authentication token is missing." })
        } else {
            const authtoken = authHeader.replace(/^Bearer\s+/i, '');
            //if there is no token
            if (!authtoken) return res.json({ AccessStatus: false, message: "Invalid token format." })

            //decoding the token
            const decoded = jwt.verify(authtoken, process.env.JWT_SECRETE_KEY)
            //checking whether user exist or not
            const admin = await AdminModel.findOne({ email: decoded.email })
            if (!admin) return res.json({ AccessStatus: false, status: false, message: "Unauthorized access. Admin not found." })
            req.admin = admin
            next()
        }

    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || "Unauthorized" })
    }
}