import express from "express";
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  updateUser,
} from "./../controllers/userController.js";
import {
  signup,
  login,
  forgetPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

router.use(protect);

router.patch("/update-password", updatePassword);
router.get("/me", getMe, getUser);
router.patch("/update-me", updateMe);
router.patch("/delete-me", deleteMe);

router.use(restrictTo("admin"));
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
