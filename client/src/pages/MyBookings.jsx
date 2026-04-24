import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import Title from "../components/Title";
import toast from "react-hot-toast";

const MyBookings = () => {
  const {
    axios,
    getToken,
    user,
    navigate,
    isMockMode,
    bookings: mockBookings,
    currency,
  } = useAppContext();
  const [bookings, setBookings] = useState(mockBookings);

  const fetchUserBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      if (isMockMode) {
        navigate("/payment/" + bookingId);
        return;
      }
      const { data } = await axios.post(
        "/api/bookings/stripe-payment",
        { bookingId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isMockMode) {
      setBookings(mockBookings);
      return;
    }
    if (user) {
      fetchUserBookings();
    }
  }, [user, isMockMode, mockBookings]);
  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. plan your trips seamlessly with just a few clicks"
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
          <div className="w-1/3">Hotels</div>
          <div className="w-1/3">Date & Timings</div>
          <div className="w-1/3">Payment</div>
        </div>

        {bookings.map((bookings) => (
          <div
            key={bookings._id}
            className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
          >
            {/* Hotel Details */}
            <div className="flex flex-col md:flex-row">
              <img
                src={bookings.room.images[0]}
                alt="Hotel"
                className="md:w-44 rounded shadow object-cover"
              />
              <div className="flex flex-col gap-1.5 max-md:mt-3 md:ml-4">
                <p className="font-playfair text-2xl">
                  {bookings.hotel.name}{" "}
                  <span className="font-inter text-sm">
                    ({bookings.room.roomType})
                  </span>
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <img src={assets.locationIcon} alt="Location" />
                  <span>{bookings.hotel.address}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <img src={assets.guestsIcon} alt="Guests" />
                  <span>Guests: {bookings.guests}</span>
                </div>
                <p className="text-base">
                  Total: {currency}
                  {bookings.finalPrice ?? bookings.totalPrice}
                </p>
                {bookings.discountPercentage > 0 && (
                  <p className="text-xs text-green-600">
                    Discount: {bookings.discountPercentage}% ({bookings.offerCode})
                  </p>
                )}
              </div>
            </div>
            {/* Date & Timeings */}
            <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
              <div>
                <p>Check-In:</p>
                <p className="text-gray-500 text-sm">
                  {new Date(bookings.checkInDate).toDateString()}
                </p>
              </div>
              <div>
                <p>Check-Out:</p>
                <p className="text-gray-500 text-sm">
                  {new Date(bookings.checkOutDate).toDateString()}
                </p>
              </div>
            </div>
            {/* Payment Status */}
            <div className="flex flex-col items-start justify-center pt-3">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    bookings.isPaid ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <p
                  className={`text-sm ${
                    bookings.isPaid ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {bookings.isPaid ? "Paid" : "Unpaid"}
                </p>
              </div>
              {!bookings.isPaid && (
                <button
                  onClick={() => handlePayment(bookings._id)}
                  className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Pay Now
                </button>
              )}
              <button
                onClick={() => navigate("/invoice/" + bookings._id)}
                className="px-4 py-1.5 mt-3 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer"
              >
                Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
