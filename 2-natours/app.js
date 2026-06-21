import express from "express";

import morgan from "morgan";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import reviewRouter from "./routes/reviewRoute.js";
import bookinRouter from "./routes/bookingRoutes.js";

import { appError } from "./utils/appError.js";
import { globalErrorHandler } from "./controllers/errController.js";

import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import { getTourWithin } from "./controllers/tourController.js";

const app = express();

//MIDDLEWARE
// console.log(JSON.stringify(process.env.NODE_ENV.trim()));
// console.log(process.env.NODE_ENV?.trim() === "development");

if (process.env.NODE_ENV?.trim() === "development") {
  app.use(morgan("dev"));
}

//helmet for secrue http headers
app.use(helmet());

//limit req from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "too many requests for this IP, please try again in an hour",
});

app.use("/api", limiter);

//body Parser
app.use(express.json({ limit: "10kb" }));

//data satnitzation for nosql query injection : sth like email : {"$gte : ""}
app.use(mongoSanitize());

//data satnitzation for xss attacks
app.use(xss());
//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "maxGroupSize",
      "ratingsAverage",
      "ratingsQuantity",
      "difficulty",
      "price",
    ],
  }),
);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/booking", bookinRouter);

app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to our tour website 😊" });
});

app.all("*", (req, res, next) => {
  next(new appError(`cant find ${req.originalUrl} on this server`,400));
})

app.use(globalErrorHandler)



// app.all("*", (req, res, next) => {
//   // res.status(404).json({
//   //   status: "fail",
//   //   message : "ad"
//   // })
//   // const err = new Error(`cant find ${req.originalUrl} on this server`)
//   // err.statusCode = 404; 
//   // err.status = "fail"; 
//   // next(err)
//   next(new appError(`cant find ${req.originalUrl} on this server`,404));
// })

// app.use( globalErrorHandler)


// app.all("*", (req, res, next) => {
//   // res.status(404).json({
//   //   status: "fail",
//   //   message: `cant find ${req.originalUrl} on this server`,
//   // });
//   const err = new Error(`cant find ${req.originalUrl} on this server`);
//   err.statusCode = 404;
//   err.status = "fail";

//   next(err);
// });

// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

app.use(express.static(`./public`));

// ROUTE HANDLERS

// ROUTES
export default app;
