import express from "express";
import {
  createReview,
  deleteReview,
  getAllReview,
  setTourUserId,
  updateReview,
  getReview,
} from "../controllers/reviewController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route("/")
  .get(getAllReview)
  .post(protect, restrictTo("user"), setTourUserId, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

export default router;
