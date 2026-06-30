import { catchAsync } from "../utils/catchAsync.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import { Tour } from "../models/tourModel.js";
import handlerFactory from "./handlerFactory.js";
import { Booking } from "../models/bookingModel.js";

dotenv.config({ path: "./config.env" });
const stipreCliet = new Stripe(process.env.STRIPE_SECRETKEY);

export const getCheckoutSession = catchAsync(async (req, res, nex) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stipreCliet.checkout.sessions.create({
    payment_method_types: ["card"],
    // success_url: `${req.protocol}://${req.get("host")}/`,
    success_url: `${req.protocol}://${req.get("host")}/my-tours/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
  });

  res.status(200).json({
    status: "success",
    session,
  });
});

export const createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});

export const createBooking = handlerFactory.createOne(Booking);
export const getBooking = handlerFactory.getOne(Booking);
export const getAllBookings = handlerFactory.getAll(Booking);
export const updateBooking = handlerFactory.updateOne(Booking);
export const deleteBooking = handlerFactory.deleteOne(Booking);