const mongoose = require("mongoose")
const productModel = require("../Model/productModel")

const addProduct = async (req, res, next) => {
    try {
        if (Object.keys(req.files).length === 0) {
            return res.status(400).json({
                message: "Image is Required"
            })
        }
        const { name, price, category, quantityInStock } = req.body
        const imagePath = req.files.image[0].path
        const image = imagePath.replace(/^public[\\/]+/, '');
        const nameExist = await productModel.findOne({ name })
        if (nameExist) {
            return res.status(400).json({
                message: "Product Name already Exist"
            })
        }
        const newProduct = new productModel({
            name, price, category, quantityInStock, image
        })
        await newProduct.save()
        res.status(200).json({
            message: "Product added"
        })
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const listProducts = async (req, res, next) => {
    try {
        const products = await productModel.find({}).populate({
            path: "category",
            select: "-__v "
        })
        res.status(200).json({
            products: products
        })
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const productDetails = async (req, res, next) => {
    try {
        const productId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid Product Id Format"
            })
        }
        const product = await productModel.findById(productId)
        if (product) {
            return res.status(200).json({
                product: product
            })
        } else {
            return res.status(400).json({
                message: "Product Not found"
            })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const editProduct = async (req, res, next) => {
    try {
        const productId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid Product Id Format"
            })
        }
        const updatedProductData = req.body

        if (Object.keys(req.files).length !== 0) {
            const imagePath = req.files.image[0].path
            const image = imagePath.replace(/^public[\\/]+/, '');
            updatedProductData.image = image
        }
        const productTOUpdate = await productModel.findById(productId)
        if (!productTOUpdate) {
            return res.status(400).json({
                message: "Product Not Found"
            })
        }

        if (updatedProductData.name && productTOUpdate.name !== updatedProductData.name) {
            const nameExist = await productModel.findOne({ name: updatedProductData.name })
            if (nameExist) {
                return res.status(400).json({
                    message: "Name already Exist"
                })
            }
        }
        const updatedProduct = await productModel.findByIdAndUpdate(productId, updatedProductData, {
            new: true,
            runValidators: true
        })

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product details updated', Product: updatedProduct });
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }





}

const deleteProduct = async (req, res, next) => {
    try {

        const productId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid Product Id Format"
            })
        }

        const result = await productModel.findOneAndDelete({ _id: productId })

        if (result) {
            return res.status(200).json({
                message: "Product Deleted"
            })

        } else {
            return res.status(404).json({
                message: "Product not found"
            });
        }

    } catch (error) {
        res.status(error.message || 500).json({
            message: "Internal Server Error"
        })
    }
}
module.exports = {
    addProduct,
    listProducts,
    productDetails,
    editProduct,
    deleteProduct
}