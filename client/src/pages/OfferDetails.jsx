import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const OfferDetails = () => {
  const { id } = useParams();
  const { offers, navigate } = useAppContext();

  const offer = useMemo(() => offers.find((item) => String(item._id) === id), [offers, id]);

  if (!offer) {
    return (
      <div className="pt-28 px-4 md:px-16 lg:px-24 xl:px-32">
        <h1 className="text-3xl font-playfair">Offer not found</h1>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 px-4 md:px-16 lg:px-24 xl:px-32">
      <div
        className="rounded-2xl p-8 text-white bg-cover bg-center min-h-72 flex flex-col justify-end"
        style={{ backgroundImage: `url(${offer.image})` }}
      >
        <p className="bg-white text-gray-800 text-xs px-3 py-1 rounded-full inline-block w-fit">
          {offer.priceOff}% OFF
        </p>
        <h1 className="font-playfair text-4xl mt-4">{offer.title}</h1>
        <p className="mt-2 max-w-2xl">{offer.description}</p>
      </div>

      <div className="mt-8 border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-xl font-semibold">How to use</h2>
        <p className="text-gray-600 mt-2">
          Open any room, enter dates and guests, then paste offer code in checkout before
          booking.
        </p>
        {offer.code && (
          <p className="mt-4 text-sm">
            Offer code:{" "}
            <span className="font-semibold bg-gray-100 px-2 py-1 rounded">{offer.code}</span>
          </p>
        )}
        <button
          onClick={() => navigate("/rooms")}
          className="mt-6 bg-primary text-white px-5 py-2.5 rounded-md"
        >
          Explore Hotels
        </button>
      </div>
    </div>
  );
};

export default OfferDetails;
