const express = require("express");

const {
  getAllUsers,
  updateAllUsers,
  getUser,
  deleteUser,
  updateUser,
} = require("./../controllers/userControllers");

const userRouter = express.Router();
// 4) User Routes
userRouter.route("/").get(getAllUsers).post(updateAllUsers);
userRouter.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

module.exports = userRouter;
