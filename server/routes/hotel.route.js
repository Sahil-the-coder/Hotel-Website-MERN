import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { getOwnerHotels, registerHotel } from "../controllers/hotel.controller.js";

const hotelRouter = express.Router();

hotelRouter.post("/", protect, registerHotel);
hotelRouter.get("/owner", protect, getOwnerHotels);

export default hotelRouter;
