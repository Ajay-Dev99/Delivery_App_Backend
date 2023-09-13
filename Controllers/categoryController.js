const categoryModel = require("../Model/categoryModel")
const mongoose = require("mongoose")

const addCategory = async (req, res, next) => {
    try {
        const categoryName = req.body.name
        const exist = await categoryModel.findOne({ name: categoryName })
        if (exist) {
            return res.status(400).json({
                message: "The Category name already exist"
            })
        }
        const newCategory = new categoryModel({
            name: categoryName
        })
        await newCategory.save()
        res.status(200).json({
            message: "Category Added"
        })
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const listCategories = async (req, res, next) => {
    try {
        const categories = await categoryModel.find({})
        res.status(200).json({
            categories: categories
        })
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const categoryDetails = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid category ID format"
            });
        }
        const id = req.params.id;
        const categoryDetails = await categoryModel.findById(id)
        if (categoryDetails) {
            res.status(200).json({
                categoryDetails: categoryDetails
            })
        } else {
            res.status(400).json({
                message: "category Not found"
            })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const editCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id
        const updatedCategoryData = req.body

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: 'Invalid driver ID format' });
        }

        const categoryTOUpdate = await categoryModel.findById(categoryId)
        if (categoryTOUpdate) {
            if (updatedCategoryData && categoryTOUpdate.name !== updatedCategoryData.name) {
                const nameExist = await categoryModel.findOne({ name: updatedCategoryData.name })
                if (nameExist) {
                    return res.status(400).json({
                        message: "Category Name already exist"
                    })
                }
            }

            const updatedCategory = await categoryModel.findByIdAndUpdate(categoryId, updatedCategoryData, {
                new: true,
                runValidators: true,
            });

            if (!updatedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(200).json({ message: 'Category details updated', Category: updatedCategory });
        }


    } catch (error) {
        res.statu(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}


const deletCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id

        // ID validation and handling
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: 'Invalid Category ID format' });
        }


        const result = await categoryModel.findOneAndDelete({ _id: categoryId })

        if (result) {
            return res.status(200).json({
                message: "category Deleted"
            })

        } else {
            return res.status(404).json({
                message: "category not found"
            });
        }



    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

module.exports = {
    addCategory,
    listCategories,
    categoryDetails,
    editCategory,
    deletCategory
}