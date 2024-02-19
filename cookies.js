const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const SECRET_KEY = '3548RHDGSJFVDSB,CGHZFWBSDVCBZVC';

const app = express();
app.use(cookieParser());



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

app.listen(3000, () => {
    console.log('server is running on port 3000')
})
