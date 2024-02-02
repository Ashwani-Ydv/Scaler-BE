const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

/** routers */
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");

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

// app.use(checkInput);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

app.use(function (req, res) {
    res.status(200).send('Hello World');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})