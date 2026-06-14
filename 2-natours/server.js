import dotenv from "dotenv";
dotenv.config({
  path: "./config.env",
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION ...🔥");
  console.log(err.name);
  console.log(err.message);

  process.exit(1);
});
import app from "./app.js";
import mongoose, { mongo } from "mongoose";

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
  
  mongoose.connection.once("open", () => {
    console.log("Connected to:", mongoose.connection.name);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJETION ...🔥");

  console.log(err.name);
  console.log(err.message);
  server.close(() => {
    process.exit(1);
  });
});



