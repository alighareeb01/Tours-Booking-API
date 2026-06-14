import { Review } from "../models/reviewModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import factroy from "./handlerFactory.js";

export const setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
export const getAllReview = factroy.getAll(Review);
export const createReview = factroy.createOne(Review);
export const deleteReview = factroy.deleteOne(Review);
export const updateReview = factroy.updateOne(Review);
export const getReview = factroy.getOne(Review);