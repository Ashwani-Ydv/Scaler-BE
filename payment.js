const express = require('express');
const Razorpay = require('razorpay');
const shortid = require('shortid');
require('dotenv').config();

const app = express();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

console.log('key_id', process.env.RAZORPAY_KEY_ID);
console.log('key_secret', process.env.RAZORPAY_SECRET_KEY);

const options = {
    amount: 50000,  // amount in smallest currency unit
    currency: "INR",
    receipt: shortid.generate(),
    payment_capture: '0'
};

instance.orders.create(options, (err, order) => {
    if (err) {
        console.log(err);
    }
    console.log(order);
});

app.post('/checkout', async (req, res) => {
    const payment_capture = 1;
    const amount = 50000;
    const currency = 'INR';

    const options = {
        amount: amount * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture
    };

    try {
        const response = await instance.orders.create(options);
        console.log(response);
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        })
    } catch (err) {
        console.log(err);
    }
})

app.listen(3000, () => {
    console.log('server is running on port 3000');
})