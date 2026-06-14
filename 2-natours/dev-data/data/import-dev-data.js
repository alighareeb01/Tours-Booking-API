import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

import mongoose, { mongo } from "mongoose";
import fs from "fs";
import { Tour } from "../../models/tourModel.js";
import { Review } from "../../models/reviewModel.js";
import { User } from "../../models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.resolve(__dirname, "../../config.env"),
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB)
  .then(() => {
    console.log("database is connectec ");
  })
  .catch((err) => {
    console.error("db connection error", err.message);
  });

//read json file

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./tours.json"), "utf-8"),
);
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./users.json"), "utf-8"),
);
const reviews = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./reviews.json"), "utf-8"),
);

//import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("data succesfully loaded");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("data succesfully deleted");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
console.log(process.argv);
