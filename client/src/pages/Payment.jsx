import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Payment = () => {
  const { bookingId } = useParams();
  const { bookings, markBookingPaid, navigate, currency } = useAppContext();

  const booking = useMemo(
    () => bookings.find((item) => item._id === bookingId),
    [bookings, bookingId]
  );

  const handlePayment = () => {
    const updatedBooking = markBookingPaid(bookingId);
    if (updatedBooking) {
      toast.success("Payment completed");
      navigate("/invoice/" + bookingId);
    } else {
      toast.error("Booking not found");
    }
  };

  if (!booking) {
    return (
      <div className="pt-32 px-6 md:px-16 lg:px-24">
        <h2 className="text-2xl font-playfair text-gray-800">Booking not found</h2>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 px-4 md:px-16 lg:px-24 xl:px-32">
      <h1 className="font-playfair text-4xl text-gray-800">Payment</h1>
      <div className="mt-8 max-w-2xl border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        <p className="text-gray-700">
          <span className="font-medium">Hotel:</span> {booking.hotel.name}
        </p>
        <p className="text-gray-700 mt-2">
          <span className="font-medium">Total Amount:</span> {currency}
          {booking.finalPrice ?? booking.totalPrice}
        </p>
        {booking.discountPercentage > 0 && (
          <p className="text-green-600 text-sm mt-1">
            Discount: {booking.discountPercentage}% ({booking.offerCode})
          </p>
        )}
        <p className="text-gray-500 mt-1 text-sm">
          Secure mock checkout for development flow.
        </p>
        <button
          onClick={handlePayment}
          className="mt-6 bg-primary hover:bg-primary-dull text-white px-6 py-2.5 rounded-md cursor-pointer"
        >
          Pay {currency}
          {booking.finalPrice ?? booking.totalPrice}
        </button>
      </div>
    </div>
  );
};

export default Payment;
