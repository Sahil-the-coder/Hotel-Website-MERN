import Offer from "../models/offer.model.js";
import Room from "../models/room.model.js";

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

const defaultOffers = [
  {
    title: "Summer Escape Package",
    description: "Enjoy a complimentary night and daily breakfast",
    code: "SUMMER25",
    priceOff: 25,
    expiryDate: "2027-08-31T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
    applicableScope: "all",
  },
  {
    title: "India City Saver",
    description: "Special offer for premium stays within India.",
    code: "INDIA18",
    priceOff: 18,
    expiryDate: "2027-09-20T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80",
    applicableScope: "india",
  },
  {
    title: "Global Luxury Retreat",
    description: "Book early and save on international premium stays.",
    code: "LUXURY30",
    priceOff: 30,
    expiryDate: "2027-09-25T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    applicableScope: "international",
  },
  {
    title: "Weekend Flash Deal",
    description: "Instant discount for quick weekend escapes.",
    code: "WEEKEND12",
    priceOff: 12,
    expiryDate: "2027-10-31T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80",
    applicableScope: "all",
  },
  {
    title: "India Family Escape",
    description: "Family savings on selected India city properties.",
    code: "FAMILY15",
    priceOff: 15,
    expiryDate: "2027-11-30T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1501117716987-c8e1ecb210f9?w=1200&q=80",
    applicableScope: "india",
  },
  {
    title: "International Business Stay",
    description: "Exclusive deal for global business travel plans.",
    code: "BIZ20",
    priceOff: 20,
    expiryDate: "2027-12-31T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?w=1200&q=80",
    applicableScope: "international",
  },
];

const seedOffersIfEmpty = async () => {
  const count = await Offer.countDocuments();
  if (!count) {
    await Offer.insertMany(defaultOffers);
  }
};

const getOffers = async (req, res) => {
  try {
    await seedOffersIfEmpty();
    const offers = await Offer.find({
      isActive: true,
      expiryDate: { $gte: new Date() },
    }).sort({ createdAt: -1 });
    res.json({ success: true, offers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.json({ success: false, message: "Offer not found" });
    res.json({ success: true, offer });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const validateOffer = async (req, res) => {
  try {
    const { code, roomId } = req.body;
    const offer = await Offer.findOne({ code: code?.trim().toUpperCase() });
    if (!offer || !offer.isActive || new Date(offer.expiryDate) < new Date()) {
      return res.json({ success: false, message: "Invalid or expired offer code" });
    }
    if (roomId) {
      const room = await Room.findById(roomId).populate("hotel");
      if (room?.hotel?.city) {
        const isIndianHotel = indianCities.has(room.hotel.city);
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
      }
    }
    res.json({ success: true, offer });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { getOffers, getOfferById, validateOffer };
