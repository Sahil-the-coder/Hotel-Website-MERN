import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { mockRooms } from "../data/mockData";
import { exclusiveOffers as localOffers } from "../assets/assets";

axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState(() => {
    try {
      const cached = localStorage.getItem("quickstay_mock_bookings");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [isMockMode, setIsMockMode] = useState(false);
  const [offers, setOffers] = useState([]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");
      if (data.success) {
        if (Array.isArray(data.rooms) && data.rooms.length > 0) {
          setRooms(data.rooms);
        } else {
          setIsMockMode(true);
          setRooms(mockRooms);
        }
      } else {
        setIsMockMode(true);
        setRooms(mockRooms);
      }
    } catch (error) {
      setIsMockMode(true);
      setRooms(mockRooms);
    }
  };

  const fetchOffers = async () => {
    try {
      const { data } = await axios.get("/api/offers");
      if (data.success) {
        setOffers(data.offers);
      } else {
        setOffers(localOffers);
      }
    } catch (error) {
      setOffers(localOffers);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities);
      } else {
        // Retry fetching user details after 5 seconds
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
    fetchOffers();
  }, []);

  useEffect(() => {
    if (isMockMode) {
      localStorage.setItem("quickstay_mock_bookings", JSON.stringify(bookings));
    }
  }, [bookings, isMockMode]);

  const createMockBooking = ({
    roomId,
    checkInDate,
    checkOutDate,
    guests,
    offerCode = "",
    discountPercentage = 0,
    paymentMethod = "Pay At Hotel",
  }) => {
    const room = rooms.find((item) => item._id === roomId);
    if (!room) return null;

    const nights = Math.max(
      1,
      Math.ceil(
        (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
          (1000 * 3600 * 24)
      )
    );
    const totalPrice = nights * room.pricePerNight;
    const discountAmount = Math.round((totalPrice * discountPercentage) / 100);
    const finalPrice = totalPrice - discountAmount;
    const booking = {
      _id: `booking-${Date.now()}`,
      room,
      hotel: room.hotel,
      checkInDate,
      checkOutDate,
      guests: Number(guests),
      totalPrice,
      finalPrice,
      offerCode,
      discountPercentage,
      discountAmount,
      isPaid: paymentMethod === "Stripe",
      paymentMethod,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [booking, ...prev]);
    return booking;
  };

  const markBookingPaid = (bookingId) => {
    let paidBooking = null;
    setBookings((prev) =>
      prev.map((booking) => {
        if (booking._id === bookingId) {
          paidBooking = { ...booking, isPaid: true, paymentMethod: "Stripe" };
          return paidBooking;
        }
        return booking;
      })
    );
    return paidBooking;
  };

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    searchedCities,
    setSearchedCities,
    axios,
    rooms,
    setRooms,
    bookings,
    setBookings,
    isMockMode,
    offers,
    setOffers,
    createMockBooking,
    markBookingPaid,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => useContext(AppContext);

export { AppProvider, useAppContext };
