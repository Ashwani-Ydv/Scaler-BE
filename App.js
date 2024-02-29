const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

/** routers */
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL;

/** DB Connection */
mongoose.connect(DB_URL).then((connection) => {
    console.log("DB is connected");
}).catch((err) => {
    console.log("vfjde", err);
})

const app = express();
const data = fs.readFileSync("./data.json", "utf-8");
const userData = JSON.parse(data);
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.path}`)
    next();
})

// app.use('/search', function (req, res) {
//     const sortParams = req.query.sort;
//     const selectedParams = req.query.select;
//     console.log('sort', sortParams);
//     console.log('selected', selectedParams);
//     res.status(200).json({
//         message: 'search successfull',
//         data: req.query
//     })
// })

// app.use(checkInput);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        status: 500,
        message: message
    })
})

app.use(function (req, res) {
    res.status(200).send('Hello World');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})