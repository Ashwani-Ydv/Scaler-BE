const express = require("express");
const productRouter = express.Router();
const {
    getProductHandler,
    createProducthandler,
    getProductById,
    updateProductById,
    deleteProductById
} = require('../controllers/productController');

const { checkInput } = require("../utils/crudFactory");
const { protectRoute, isAuthorized } = require("../controllers/authController");

const authorizedProductRoles = ["admin", "ceo", "sales"];
const Product = require("../models/productModel");

/** Product routes */

productRouter.get("/", getProducts);
// productRouter.post("/", createProductHandler);
productRouter.post("/", checkInput, protectRoute, isAuthorized(authorizedProductRoles), createProducthandler);
productRouter.get("/bigBillionDay", getBigBillionProducts, getProducts);
productRouter.get("/:id", getProductById);
productRouter.patch("/:id", updateProductById);
// productRouter.delete("/:id", deleteProductById);
productRouter.delete("/:id", protectRoute, isAuthorized(authorizedProductRoles), deleteProductById);


async function getBigBillionProducts(req, res, next) {
    req.query.filter = JSON.stringify({ stock: { lt: 50 }, averageRating: { lt: 5 } });
    next();
}

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
        const filterObjStr = JSON.stringify(filterObj).replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
        const filterFinalObj = JSON.parse(filterObjStr);
        queryResPromise = await queryResPromise.find(filterFinalObj);
    }

    const result = await queryResPromise;
    res.status(200).json({
        message: 'search successfull',
        data: result
    })
}

module.exports = productRouter;