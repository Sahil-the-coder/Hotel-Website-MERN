import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Invoice = () => {
  const { bookingId } = useParams();
  const { bookings, currency } = useAppContext();

  const booking = useMemo(
    () => bookings.find((item) => item._id === bookingId),
    [bookings, bookingId]
  );

  if (!booking) {
    return (
      <div className="pt-32 px-6 md:px-16 lg:px-24">
        <h2 className="text-2xl font-playfair text-gray-800">Invoice not found</h2>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-3xl mx-auto border border-gray-200 rounded-xl p-8 bg-white shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-playfair">Invoice</h1>
            <p className="text-gray-500 text-sm mt-1">Booking #{booking._id}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm cursor-pointer"
          >
            Print Invoice
          </button>
        </div>
        <div className="mt-8 space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Hotel:</span> {booking.hotel.name}
          </p>
          <p>
            <span className="font-medium">Address:</span> {booking.hotel.address}
          </p>
          <p>
            <span className="font-medium">Room Type:</span> {booking.room.roomType}
          </p>
          <p>
            <span className="font-medium">Guests:</span> {booking.guests}
          </p>
          <p>
            <span className="font-medium">Check In:</span>{" "}
            {new Date(booking.checkInDate).toDateString()}
          </p>
          <p>
            <span className="font-medium">Check Out:</span>{" "}
            {new Date(booking.checkOutDate).toDateString()}
          </p>
          <p>
            <span className="font-medium">Payment:</span>{" "}
            {booking.isPaid ? "Paid (Stripe)" : "Pending"}
          </p>
          {booking.discountPercentage > 0 && (
            <p>
              <span className="font-medium">Offer:</span> {booking.offerCode} (
              {booking.discountPercentage}% off)
            </p>
          )}
          <p className="text-xl mt-4 font-semibold">
            Total: {currency}
            {booking.finalPrice ?? booking.totalPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
