import Booking from "../models/booking.model.js";
import Hotel from "../models/hotel.model.js";
import Room from "../models/room.model.js";
import Offer from "../models/offer.model.js";
import transporter from "../configs/nodemailer.js";
import stripe from "stripe";

const indianCities = new Set([
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Jaipur",
  "Goa",
  "Pune",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Kochi",
]);

// Check availability of room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.log(error.message);
  }
};

const checkAvailabilityApi = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, room } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    res.json({ success: true, isAvailable });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, room, guests, offerCode = "" } = req.body;
    const user = req.user._id;

    // Before booking check availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    // Get total price from room
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    // Calculate total price based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;
    let discountPercentage = 0;
    let discountAmount = 0;
    let offerId = null;
    const normalizedCode = offerCode.trim().toUpperCase();

    if (normalizedCode) {
      const offer = await Offer.findOne({ code: normalizedCode });
      if (!offer || !offer.isActive || new Date(offer.expiryDate) < new Date()) {
        return res.json({ success: false, message: "Invalid or expired offer code" });
      }
      const isIndianHotel = indianCities.has(roomData.hotel.city);
      if (offer.applicableScope === "india" && !isIndianHotel) {
        return res.json({
          success: false,
          message: "This offer is only valid for India hotels",
        });
      }
      if (offer.applicableScope === "international" && isIndianHotel) {
        return res.json({
          success: false,
          message: "This offer is only valid for international hotels",
        });
      }
      discountPercentage = offer.priceOff;
      discountAmount = Math.round((totalPrice * discountPercentage) / 100);
      offerId = offer._id.toString();
    }
    const finalPrice = totalPrice - discountAmount;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
      finalPrice,
      offer: offerId,
      offerCode: normalizedCode,
      discountPercentage,
      discountAmount,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: "Hotel Booking Details",
      html: `
        <h2>Your Booking Details</h2>
        <p>Dear ${req.user.username},</p>
        <p>Thank you for your booking! Here are your details:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
          <li><strong>Location:</strong> ${roomData.hotel.address}</li>
          <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
          <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || "$"} ${
        booking.finalPrice
      }</li>
        </ul>
        <p>We look forward to welcoming you !</p>
        <p>If you need to make any changes, feel free to contact us.</p>
      `,
    };
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Booking created" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get all booking for a user
const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get hotel booking detail for owner
const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: "No hotel found" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });
    // Total bookings
    const totalBookings = bookings.length;
    // Total revenue
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + (booking.finalPrice || booking.totalPrice),
      0
    );

    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    const roomData = await Room.findById(booking.room).populate("hotel");
    const totalPrice = booking.finalPrice || booking.totalPrice;
    const { origin } = req.headers;

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: { name: roomData.hotel.name },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ];
    // Create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: { bookingId },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Payment failed" });
  }
};

export {
  checkAvailabilityApi,
  createBooking,
  getUserBookings,
  getHotelBookings,
  stripePayment,
};
