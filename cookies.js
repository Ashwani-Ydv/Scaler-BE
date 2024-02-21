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


const SECRET_KEY = '3548RHDGSJFVDSB,CGHZFWBSDVCBZVC';

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

app.get('/signin', async (req, res) => {
    const payload = 1234;
    try {
        jwt.sign(
            { data: payload },
            SECRET_KEY,
            { expiresIn: '1h' },
            function (err, data) {
                if (err) {
                    throw new Error(err.message);
                }
                res.cookie('token', data, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true
                });
                res.json({
                    message: data
                })
            })
    } catch (err) {
        res.json({
            message: err
        })
    }
})

app.get('/verify', (req, res) => {
    try {
        const { token } = req.cookies
        console.log('cookies', req.cookies);
        const decoded = jwt.verify(token, SECRET_KEY)
        res.json({
            message: decoded
        })

    } catch (err) {
        res.json({
            message: err
        })
    }
})

app.post('/signup', async (req, res) => {
    try {
        const userDetails = req.body;
        console.log('userDetails', userDetails);
        const user = await User.create(userDetails);
        res.json({
            message: 'User created',
            user
        })
    } catch (err) {
        console.log(err);
    }

})

app.post('/login', async (req, res) => {
    //user validation
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        console.log("user", user);
        if (!user) {
            res.status(400).json({
                message: "user not found"
            })
        }
        else {
            if (user.password === password) {
                const token = jwt.sign({ data: user._id }, SECRET_KEY);
                res.cookie("token", token, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true
                })
                res.status(200).json({
                    message: "Login successfull",
                    data: user
                })
            }
            else {
                res.status(400).json({
                    message: "invalid credentials"
                })
            }
        }
    } catch (err) {
        console.log(err);
    }
})

const protectRoute = async function (req, res, next) {
    try {
        const { token } = req.cookies;
        const decoded = jwt.verify(token, SECRET_KEY)
        const user = await User.findById(decoded.data);
        if (!user) {
            res.status(400).json({
                message: "user not found"
            })
        }
        else {
            req.user = user;
            next();
        }

    } catch (err) {
        console.log(err);
    }
}

app.get('/userData', protectRoute, async function (req, res) {
    res.status(200).json({
        message: 'user data fetched',
        data: req.user
    })
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})
