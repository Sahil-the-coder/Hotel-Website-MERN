import Hotel from "../models/hotel.model.js";
import User from "../models/user.model.js";

// Register a hotel
const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    // Check if user already registered
    const hotel = await Hotel.findOne({ owner });
    if (hotel) {
      return res.json({ success: false, message: "Hotel already registered" });
    }

    await Hotel.create({ name, address, contact, city, owner });
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({ success: true, message: "Hotel registered" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const getOwnerHotels = async (req, res) => {
  try {
    // #region agent log
    fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"pre-fix",hypothesisId:"H5",location:"hotel.controller.js:getOwnerHotels:entry",message:"get-owner-hotels-entry",data:{hasReqUser:Boolean(req.user),reqUserId:req.user?._id || null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const hotels = await Hotel.find({ owner: req.user._id }).sort({ createdAt: -1 });
    // #region agent log
    fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"pre-fix",hypothesisId:"H2",location:"hotel.controller.js:getOwnerHotels:success",message:"get-owner-hotels-success",data:{hotelsCount:hotels.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    res.json({ success: true, hotels });
  } catch (error) {
    // #region agent log
    fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"pre-fix",hypothesisId:"H3",location:"hotel.controller.js:getOwnerHotels:catch",message:"get-owner-hotels-error",data:{errorMessage:error?.message || ""},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { registerHotel, getOwnerHotels };
export default registerHotel;
