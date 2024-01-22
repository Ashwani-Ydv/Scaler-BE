const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const short = require('short-uuid');
const { error } = require('console');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL;

/** DB Connection */
mongoose.connect(DB_URL).then((connection) => {
    console.log("DB is connected");
}).catch((err) => {
    console.log("vfjde", err);
})


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    confirmPassword: {
        type: String,
        required: true,
        minLength: 8,
        validate: {
            validator: function () {
                return this.password === this.confirmPassword
            },
            message: "Password and Confirm Password should be same"
        }
    },
    address: {
        type: String,
        required: true
    }
})

const User = mongoose.model("User", userSchema);

const app = express();
const data = fs.readFileSync("./data.json", "utf-8");
const userData = JSON.parse(data);
app.use(express.json());

app.get('/api/user/', getUserHandler);
app.post('/api/user/', createUserHandler);
app.get('/api/user/:id', getuserById);

async function getUserHandler(req, res) {
    try {
        const userData = await User.find();
        if (userData.length === 0)
            throw new Error("No user found");
        else {
            msg = 'Data Found'
            res.json({
                status: 'success',
                statusCode: 200,
                message: msg,
                data: userData

            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

async function createUserHandler(req, res) {
    try {
        const userDetails = req.body;
        const isEmpty = Object.keys(userDetails).length === 0;
        if (isEmpty) {
            res.status(400).json({
                status: 400,
                message: "Body can not be empty"
            })
        }
        else {
            const user = await User.create(userDetails);
            res.status(200).json({
                message: "User created successfully",
                data: user
            })
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
    // const id = short.generate();

}

async function getuserById(req, res) {
    try {
        const { id } = req.params;
        // const user = userData.find((user) => user.id === id);
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        res.json({
            status: 200,
            message: "User Found",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
}


app.use(function (req, res) {
    res.status(200).send('Hello World');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})