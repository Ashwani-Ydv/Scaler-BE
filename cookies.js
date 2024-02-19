const express = require('express');

const app = express();


//home
app.get('/', (req, res) => {
    res.json({
        message: 'welcome to home page'
    })
})

//product

app.get('/products', (req, res) => {
    res.json({
        message: 'welcome to product page'
    })
})

//clear cookies
app.get('/clearcookies', (req, res) => {
    res.json({
        message: 'clear cookies'
    })
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})
