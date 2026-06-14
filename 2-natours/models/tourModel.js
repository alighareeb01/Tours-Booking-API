import mongoose, { mongo } from "mongoose";
import slugify from "slugify";
import { User } from "./userModel.js";
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "must have a name"],
      trim: true,
      maxLength: [40, "tour name must be less than or qual 40"],
      minLength: [10, "tour name must be bigger than or qual 10"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    slug: String,
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      // unique: true,
      required: [true, "must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: function (val) {
        return val < this.price;
      },
      message: "discontu must be less th an prics",
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    Locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ price: 1, ratingsAverage: 1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// DOCUMEt MIDDLEWAR
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
});
tourSchema.pre("save", function (next) {
  console.log("Will save document...");
});

// tourSchema.pre(/^find/, function (docs) {
//   this.find({ secretTour: { $ne: true } });

//   this.start = Date.now();
// });

tourSchema.post(/^find/, function (docs) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
});

// tourSchema.pre("aggregate", function () {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
// });

// tourSchema.pre("save", async function () {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
// });

tourSchema.pre(/^find/, function () {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
});

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

export const Tour = mongoose.model("Tour", tourSchema);
