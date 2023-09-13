const express = require("express");
const { driverLogin } = require("../../Controllers/driverController");
const { driverLoginValidation } = require("../../Middlewares/validations/validators");
const driverAuth = require("../../Middlewares/authMiddlewares/driverAuth");
const { listProducts } = require("../../Controllers/productController");
const { listVentors } = require("../../Controllers/ventorController");
const { addToCart, listCart, cartDetails } = require("../../Controllers/cartController");
const { placeOrder, listOrders } = require("../../Controllers/orderController");
const router = express.Router()

router.post("/login", driverLoginValidation, driverLogin)
router.get("/listProducts", driverAuth, listProducts)
router.get("/listVentors", driverAuth, listVentors)
router.post("/addToCart", driverAuth, addToCart)
router.get("/listCart", driverAuth, listCart)
router.get("/cartDetails/:id", driverAuth, cartDetails)
router.post("/placeOrder/:id", driverAuth, placeOrder)
router.get("/listOrders", driverAuth, listOrders)



module.exports = router;