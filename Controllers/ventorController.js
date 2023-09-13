const mongoose = require("mongoose")
const ventorModel = require("../Model/ventorModel")

const addVentor = async (req, res, next) => {
    try {

        const { email, name, buildingNo, street, district, pincode, phone_number } = req.body
        const emailExist = await ventorModel.findOne({ email })
        if (emailExist) {
            res.status(400).json({
                message: "Email already exist for another ventor"
            })
        } else {
            const location = {
                buildingNo, street, district, pincode
            }
            const newVentor = new ventorModel({
                email, name, location, phone_number
            })
            await newVentor.save()
            res.status(200).json({
                message: "ventor added"
            })
        }

    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const listVentors = async (req, res, next) => {
    try {
        const ventors = await ventorModel.find({})
        res.status(200).json({ ventors: ventors })
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const ventorDetails = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid ventor ID format"
            });
        }
        const id = req.params.id;
        const ventorData = await ventorModel.findById(id)
        if (ventorData) {
            res.status(200).json({
                ventorData: ventorData
            })
        } else {
            res.status(400).json({
                message: "Ventor Not found"
            })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}


const editVentorData = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid ventor ID format"
            });
        }

        const updatedVentorData = req.body
        const id = req.params.id
        const ventorToUpdate = await ventorModel.findById(id)
        if (updatedVentorData.email && ventorToUpdate.email !== updatedVentorData.email) {
            const exist = await ventorModel.findOne({ email: updatedVentorData.email })
            if (exist) {
                return res.status(400).json({
                    messag: "Email address exist for another ventor"
                })
            }
        }
        const updateVentor = await ventorModel.findByIdAndUpdate(id, updatedVentorData, {
            new: true,
            runValidators: true,
        });

        if (!updateVentor) {
            return res.status(404).json({ message: 'ventor not found' });
        }

        res.status(200).json({ message: 'ventor details updated', ventor: updateVentor });


    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const deleteVenotr = async (req, res, next) => {
    try {
        // ID validation and handling
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid driver ID format' });
        }

        const id = req.params.id
        const result = await ventorModel.findOneAndDelete({ _id: id })

        if (result) {
            return res.status(200).json({
                message: "Ventor Deleted"
            })

        } else {
            return res.status(404).json({
                message: "Ventor not found"
            });
        }


    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

module.exports = {
    addVentor,
    listVentors,
    ventorDetails,
    editVentorData,
    deleteVenotr
}