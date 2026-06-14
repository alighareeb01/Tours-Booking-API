import express from "express";
import {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
  topCheaps,
  getTourStats,
  getMonthlyPlan,
  getTourWithin,
  getDistances,
} from "../controllers/tourController.js";
import { protect, restrictTo } from "../controllers/authController.js";
import { createReview } from "../controllers/reviewController.js";
import { Review } from "../models/reviewModel.js";
import reviewRouter from "../routes/reviewRoute.js";

const router = express.Router();

router.route("/top-5-cheap").get(topCheaps, getAllTours);

router.route("/tour-stats").get(getTourStats);
router
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("lead-guide", "admin", "guide"), getMonthlyPlan);

// router
//   .route("/tours-within/:distance/center/:latlng/unit/:unit")
//   .get(getTourWithin);
router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getTourWithin);

router.route("/distances/:latlng/unit/:unit").get(getDistances);


router
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("lead-guide", "admin"), createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("lead-guide", "admin"), updateTour)
  .delete(protect, restrictTo("lead-guide", "admin"), deleteTour);

router.use("/:tourId/reviews", reviewRouter);
export default router;
