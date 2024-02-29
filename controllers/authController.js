const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const mongoose = require('mongoose');
const productRouter = require('./routes/productRouter');
require('dotenv').config();

const SECRET_KEY = '3548RHDGSJFVDSB,CGHZFWBSDVCBZVC';

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

const otpGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        console.log("user", user);
        if (!user) {
            res.status(404).json({
                status: "fail",
                message: "user not found"
            })
        }
        else {
            console.log("inside else");
            const token = otpGenerator();
            user.token = token.toString();
            user.tokenTime = Date.now() + 5 * 60 * 1000;// 5 minutes
            await user.save({ validateBeforeSave: false });
            console.log("inside else1");
            emailBuilder(
                user.email,
                "Reset Password",
                `Your otp is ${token}`
            ).then(() => {
                console.log("email sent");
            })
                .catch((err) => {
                    console.log("Error in sending email", err);
                });
            res.status(200).json({
                status: "success",
                message: "otp sent to your email"
            })
        }
    } catch {
        res.json({
            message: "user not found"
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { token, password, email } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                status: "fail",
                message: "user not found"
            })
        }
        else {
            if (user.token === token && user.tokenTime > Date.now()) {
                user.password = password;
                user.token = undefined;
                user.tokenTime = undefined;
                await user.save({ validateBeforeSave: false });
                res.status(200).json({
                    status: "success",
                    message: "password updated successfully"
                })
            }
            else {
                res.status(400).json({
                    status: "fail",
                    message: "invalid token"
                })
            }
        }
    } catch (err) {
        res.json({
            message: err
        })
    }
}

module.exports = { protectRoute, forgotPassword, resetPassword, app, SECRET_KEY, emailBuilder, otpGenerator };