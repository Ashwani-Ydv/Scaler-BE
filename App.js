const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const { getUserHandler,
    createUserHandler,
    getuserById,
    updateUserById,
    deleteUserById,
    checkInput
} = require('./controllers/userController')
const {
    getProductHandler,
    createProductHandler,
    getProductById,
    updateProductById,
    deleteProductById
} = require('./controllers/productController')

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

app.get('/api/user/', getUserHandler);
app.post('/api/user/', checkInput, createUserHandler);
app.get('/api/user/:id', getuserById);
app.patch('/api/user/:id', updateUserById);
app.delete('/api/user/:id', deleteUserById);

app.get('/api/product/', getProductHandler);
app.post('/api/product/', checkInput, createProductHandler);
app.get('/api/product/:id', getProductById);
app.patch('/api/product/:id', updateProductById);
app.delete('/api/product/:id', deleteProductById);

app.use(function (req, res) {
    res.status(200).send('Hello World');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})