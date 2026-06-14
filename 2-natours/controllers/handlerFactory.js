import { appError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

import { APIFeatures } from "../utils/apiFeatures.js";

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new appError("could not find a document with that id", 404));
    }

    res.status(204).json({
      status: "success",
      message: "deleted",
      data: null,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new appError("could not find a document with that id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
        message: "updated",
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: "sucess",
      data: {
        data: newDoc,
      },
    });
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new appError("could not find a docuemt with that id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const feature = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    const docs = await feature.query;

    // const tours = await Tour.find();
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });

export default { deleteOne, updateOne, createOne, getOne, getAll };
