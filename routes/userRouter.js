const express = require("express");
const userRouter = express.Router();
const { getUserHandler,
    createUserHandler,
    getuserById,
    updateUserById,
    deleteUserById,
    checkInput,
} = require('../controllers/userController')

const {
    forgetPassword,
    resetPassword,
    protectRoute,
    isAdmin,
    loginHandler,
    signUpHandler
} = require('../controllers/authController');

userRouter.use(protectRoute)

/** Product routes */

userRouter.get("/", getUserHandler);
// userRouter.post("/", createUserHandler);
userRouter.get("/", isAdmin, getUserHandler)
userRouter.post("/", checkInput, signUpHandler);
userRouter.post("/login", loginHandler);
userRouter.get("/:id", getuserById);
userRouter.patch("/:id", updateUserById);
userRouter.delete("/:id", deleteUserById);
// userRouter.post("/forgotpassword", forgotPassword);
// userRouter.patch("/resetpassword/:token", resetPassword);

module.exports = userRouter;