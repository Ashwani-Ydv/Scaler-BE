const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const mongoose = require('mongoose');
const productRouter = require('./routes/productRouter');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

/** DB Connection */
mongoose.connect(DB_URL).then((connection) => {
    console.log("DB is connected");
}).catch((err) => {
    console.log("vfjde", err);
})


const app = express();
app.use(cookieParser());
app.use(express.json());



//home
app.get('/', (req, res) => {
    res.cookie('scaler', 'home', { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true })
    res.json({
        message: 'welcome to home page'
    })
})

//product

app.get('/products', (req, res) => {
    console.log(req.cookies);
    const { scaler } = req.cookies
    if (scaler) {
        res.json({
            message: 'welcome to product page'
        })
    }
    else {
        res.json({
            message: 'You are visiting for the first time'
        })
    }

})

//clear cookies
app.get('/clearcookies', (req, res) => {
    res.clearCookie('scaler', { path: '/' })
    res.json({
        message: 'cookie is cleared'
    })
})

app.get('/userData', protectRoute, async function (req, res) {
    res.status(200).json({
        message: 'user data fetched',
        data: req.user
    })
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})
