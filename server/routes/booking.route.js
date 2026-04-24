import express from "express";
import {
  checkAvailabilityApi,
  createBooking,
  getUserBookings,
  getHotelBookings,
  stripePayment,
} from "../controllers/booking.controller.js";
import protect from "../middlewares/auth.middleware.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityApi);
bookingRouter.post("/book", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/hotel", protect, getHotelBookings);
bookingRouter.post("/stripe-payment", protect, stripePayment);

export default bookingRouter;
