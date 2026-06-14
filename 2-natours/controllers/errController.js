import { appError } from "../utils/appError.js";

function sendErrDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

function sendErrProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
}

function handleCastErrorDb(err) {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new appError(msg, 400);
}
function handleDuplicateFieldsDb(err) {
  const value = err.message.match(/dup key: \{ name: "([^"]+)" \}/)[1];

  const msg = `Duplicate Fileds value : ${value}`;
  return new appError(msg, 400);
}
function handleValidationErrorDb(err) {
  const errors = Object.values(err.errors).map((el) => el.message);

  const msg = `Invalid input fields :${errors.join(", ")}`;
  return new appError(msg, 400);
}
function handleJWTError() {
  return new appError("Invalid token , please login again", 401);
}
function handleJWTExpire() {
  return new appError("your token has expired please login again", 401);
}

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV.trim() === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV.trim() === "production") {
    let error = err;

    if (error.name === "CastError") error = handleCastErrorDb(error);
    if (error.code === 11000) error = handleDuplicateFieldsDb(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDb(error);

    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpire();
    sendErrProd(error, res);
  }
};
