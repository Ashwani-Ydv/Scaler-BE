const express = require("express");
const productRouter = express.Router();
const {
    getProductHandler,
    createProductHandler,
    getProductById,
    updateProductById,
    deleteProductById
} = require('../controllers/productController');
const Product = require("../models/productModel");

/** Product routes */

productRouter.get("/", getProducts);
productRouter.post("/", createProductHandler);
productRouter.get("/:id", getProductById);
productRouter.patch("/:id", updateProductById);
productRouter.delete("/:id", deleteProductById);

async function getProducts(req, res) {
    const sortQuery = req.query.sort;
    const selectQuery = req.query.select;
    console.log('sortQuery', sortQuery);
    console.log('selectQuery', selectQuery);
    /** sorting */
    let QueryResPromise = Product.find();
    if (sortQuery) {
        const [sortParams, order] = sortQuery.split(" ")
        console.log('sortParams', sortParams);
        console.log('order', order);
        if (order === 'asc') {
            QueryResPromise = QueryResPromise.sort(sortParams);
        }
        else {
            QueryResPromise = QueryResPromise.sort(`-${sortParams}`);
        }
    }
    if (selectQuery) {
        QueryResPromise = QueryResPromise.select(selectQuery);
    }
    const result = await QueryResPromise;
    res.status(200).json({
        message: 'search successfull',
        data: result
    })
}

module.exports = productRouter;