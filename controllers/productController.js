const Product = require('../models/productModel')
const {
    checkInput,
    getAllFactory,
    getElementByIdFactory,
    createElementFactory,
    updateElementByIdFactory,
    deleteElementByIdFactory
} = require('../utils/crudFactory');

/**handlers */
/** Route handlers */

const getProductHandler = getAllFactory(Product);
const getProductById = getElementByIdFactory(Product);
const createProductHandler = createElementFactory(Product);
const updateProductById = updateElementByIdFactory(Product);
const deleteProductById = deleteElementByIdFactory(Product);

module.exports = { getProductHandler, createProductHandler, getProductById, updateProductById, deleteProductById, checkInput }