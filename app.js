const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require("mongoose")
const path = require('path');
require('dotenv').config()


const adminRoutes = require('./api/routes/adminRoutes')
const driverRoutes = require("./api/routes/driverRoutes")


//devtool
app.use(morgan('dev'))

//Parse the request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//cors "currently req accept form all servers"
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}))

//Database Connection
mongoose.connect("mongodb://0.0.0.0:27017/wholesale", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB connection succesfull");
}).catch((err) => {
    console.log(err);
})

//Router middlewares
app.use("/admin",adminRoutes)
app.use("/driver",driverRoutes)

app.use(express.static(path.join(__dirname, 'public')));

//Error handling for Notfound
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
})

//Error handling
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;