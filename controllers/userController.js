const User = require('../models/userModel')
const emailBuilder = require('../nodeMailer');
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

const otpGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            res.status(404).json({
                status: "fail",
                message: "user not found"
            })
        }
        else {
            const token = otpGenerator();
            user.token = token.toString();
            user.tokenTime = Date.now() + 5 * 60 * 1000;// 5 minutes
            await user.save({ validateBeforeSave: false });
            emailBuilder(
                user.email,
                "Reset Password",
                `Your otp is ${token}`
            ).then(() => {
                console.log("email sent");
            })
                .catch((err) => {
                    console.log("Error in sending email", err);
                });
            res.status(200).json({
                status: "success",
                message: "otp sent to your email"
            })
        }
    } catch {
        res.json({
            message: "user not found"
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User
    } catch (err) {
        res.json({
            message: err
        })
    }
}

module.exports = { getUserHandler, createUserHandler, getuserById, updateUserById, deleteUserById, checkInput, forgotPassword, resetPassword }