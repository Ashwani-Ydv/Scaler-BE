const User = require('../models/userModel')
const {
    checkInput,
    getAllFactory,
    getElementByIdFactory,
    createElementFactory,
    updateElementByIdFactory
} = require('../utils/crudFactory')

/**handlers */
/** Route handlers */

const getUserHandler = getAllFactory(User);
const getuserById = getElementByIdFactory(User);
const createUserHandler = createElementFactory(User);

async function updateUserById(req, res) {
    try {
        const { id } = req.params;
        const updatedUserData = req.body
        console.log('userid', id);
        const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, { new: true })
        if (!updatedUser) {
            throw new Error("user not found");
        }
        else {
            res.status(200).json({
                status: 200,
                message: "User updated successfully",
                data: updatedUser
            })
        }

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })

    }
}

async function deleteUserById(req, res) {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id)
        if (!deletedUser) {
            throw new Error("user not found");
        }
        else {
            res.status(200).json({
                status: 200,
                message: "User deleted successfully",
                data: deletedUser
            })
        }

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })

    }
}

module.exports = { getUserHandler, createUserHandler, getuserById, updateUserById, deleteUserById, checkInput }