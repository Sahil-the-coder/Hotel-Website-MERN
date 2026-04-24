import express from "express";
import {
  getOfferById,
  getOffers,
  validateOffer,
} from "../controllers/offer.controller.js";

const offerRouter = express.Router();

offerRouter.get("/", getOffers);
offerRouter.get("/:id", getOfferById);
offerRouter.post("/validate", validateOffer);

export default offerRouter;
