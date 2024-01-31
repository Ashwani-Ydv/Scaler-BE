const User = require('../models/userModel')
const {
    checkInput,
    getAllFactory,
    getElementByIdFactory,
    createElementFactory,
    updateElementByIdFactory,
    deleteElementByIdFactory
} = require('../utils/crudFactory')

/**handlers */
/** Route handlers */

const getUserHandler = getAllFactory(User);
const getuserById = getElementByIdFactory(User);
const createUserHandler = createElementFactory(User);
const updateUserById = updateElementByIdFactory(User);
const deleteUserById = deleteElementByIdFactory(User);


module.exports = { getUserHandler, createUserHandler, getuserById, updateUserById, deleteUserById, checkInput }