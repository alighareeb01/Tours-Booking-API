import { catchAsync } from "../utils/catchAsync.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import { Tour } from "../models/tourModel.js";

dotenv.config({ path: "./config.env" });
const stipreCliet = new Stripe(process.env.STRIPE_SECRETKEY);

export const getCheckoutSession = catchAsync(async (req, res, nex) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stipreCliet.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
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
