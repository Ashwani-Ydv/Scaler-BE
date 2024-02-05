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
    const limit = req.query.limit;
    const page = req.query.page;
    const skip = (page - 1) * limit;
    console.log('skip', skip);
    console.log('sortQuery', sortQuery);
    console.log('selectQuery', selectQuery);

    /** filtering */
    const filterQuery = req.query.filter;
    /** sorting */
    let queryResPromise = Product.find();
    // if (sortQuery) {
    //     const [sortParams, order] = sortQuery.split(" ")
    //     console.log('sortParams', sortParams);
    //     console.log('order', order);
    //     if (order === 'asc') {
    //         queryResPromise = queryResPromise.sort(sortParams);
    //     }
    //     else {
    //         queryResPromise = queryResPromise.sort(`-${sortParams}`);
    //     }
    // }
    // if (selectQuery) {
    //     queryResPromise = queryResPromise.select(selectQuery);
    // }
    // if (limit) {
    //     queryResPromise = queryResPromise.skip(skip).limit(limit)
    // }

    if (filterQuery) {
        console.log('filter', filterQuery);
        const filterObj = JSON.parse(filterQuery);
        queryResPromise = await queryResPromise.find(filterObj);
    }

    const result = await queryResPromise;
    res.status(200).json({
        message: 'search successfull',
        data: result
    })
}

module.exports = productRouter;