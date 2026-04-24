import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Offers = () => {
  const { offers } = useAppContext();

  return (
    <div className="pt-28 pb-16 px-4 md:px-16 lg:px-24 xl:px-32">
      <h1 className="font-playfair text-4xl text-gray-800">All Offers</h1>
      <p className="text-gray-500 mt-2">
        Choose an offer and apply the code during booking checkout.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {offers.map((item) => (
          <div
            key={item._id}
            className="group relative text-white rounded-xl p-5 min-h-56 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <p className="inline-block bg-white text-gray-800 text-xs px-3 py-1 rounded-full">
              {item.priceOff}% OFF
            </p>
            <h2 className="text-xl mt-4 font-semibold">{item.title}</h2>
            <p className="text-sm mt-2">{item.description}</p>
            {item.code && (
              <p className="mt-3 text-xs bg-black/30 inline-block px-2 py-1 rounded">
                Code: {item.code}
              </p>
            )}
            <Link
              to={`/offers/${item._id}`}
              className="flex items-center gap-2 mt-5 font-medium"
            >
              View Offer
              <img
                src={assets.arrowIcon}
                alt="Arrow"
                className="invert group-hover:translate-x-1 transition-all"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
