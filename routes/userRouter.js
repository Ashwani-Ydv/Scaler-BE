const express = require("express");
const userRouter = express.Router();
const { getUserHandler,
    createUserHandler,
    getuserById,
    updateUserById,
    deleteUserById,
    checkInput,
    forgotPassword,
    resetPassword
} = require('../controllers/userController')

/** Product routes */

userRouter.get("/", getUserHandler);
userRouter.post("/", createUserHandler);
userRouter.get("/:id", getuserById);
userRouter.patch("/:id", updateUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.patch("/resetpassword/:token", resetPassword);

module.exports = userRouter;