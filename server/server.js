import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import clerkWebhooks from "./controllers/clerk.webhooks.controller.js";
import stripeWebhooks from "./controllers/stripe.webhooks.controller.js";
import userRouter from "./routes/user.route.js";
import hotelRouter from "./routes/hotel.route.js";
import roomRouter from "./routes/room.route.js";
import bookingRouter from "./routes/booking.route.js";
import offerRouter from "./routes/offer.route.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
connectCloudinary();
// #region agent log
fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"pre-fix",hypothesisId:"H6",location:"server.js:startup:env-check",message:"server-env-check",data:{hasClerkPublishableKey:Boolean(process.env.CLERK_PUBLISHABLE_KEY),clerkPublishableKeyPrefix:(process.env.CLERK_PUBLISHABLE_KEY || "").slice(0,7),hasClerkSecretKey:Boolean(process.env.CLERK_SECRET_KEY),hasMongoUri:Boolean(process.env.MONGODB_URI)},timestamp:Date.now()})}).catch(()=>{});
// #endregion

// Listen to stripe webhooks
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// Middlewares
app.use(express.json());
app.use(cors());
const hasClerkKeys = Boolean(
  process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);
if (hasClerkKeys) {
  app.use(clerkMiddleware());
} else {
  // Fallback mode: avoid Clerk middleware crashes in local setup.
  app.use((req, _res, next) => {
    req.auth = () => ({ userId: null });
    next();
  });
}
// #region agent log
fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"post-fix",hypothesisId:"H7",location:"server.js:middleware:after-clerk",message:"clerk-middleware-mode",data:{hasClerkKeys,mode:hasClerkKeys?"clerk":"fallback"},timestamp:Date.now()})}).catch(()=>{});
// #endregion

app.get("/", (req, res) => res.send("API is working"));
app.use("/api/clerk", clerkWebhooks);
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/offers", offerRouter);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
