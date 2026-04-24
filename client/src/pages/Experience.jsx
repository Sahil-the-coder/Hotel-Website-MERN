const categories = [
  {
    title: "Luxury Retreats",
    description: "Premium suites, private pools, spa access, and elevated hospitality.",
    image:
      "https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200&q=80",
  },
  {
    title: "City Escapes",
    description: "Central stays near iconic landmarks, business hubs, and nightlife.",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
  },
  {
    title: "Family Friendly",
    description: "Spacious layouts, breakfast options, and kid-friendly amenities.",
    image:
      "https://images.unsplash.com/photo-1501117716987-c8e1ecb210f9?w=1200&q=80",
  },
  {
    title: "Business Ready",
    description: "Reliable internet, meeting spaces, and seamless check-in workflows.",
    image:
      "https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?w=1200&q=80",
  },
];

const testimonials = [
  {
    name: "Ananya Sharma",
    quote:
      "The filters and offers helped us find the perfect family stay in minutes.",
  },
  {
    name: "Michael Lewis",
    quote:
      "Checkout was smooth, and invoice generation made my business trip paperwork easy.",
  },
  {
    name: "Sara Kim",
    quote:
      "Loved the destination options and transparent pricing. The whole flow felt premium.",
  },
];

const Experience = () => {
  return (
    <div className="pt-24 pb-20 text-gray-700 bg-white">
      <div
        className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 rounded-2xl min-h-[410px] bg-cover bg-center p-8 md:p-14 text-white flex items-end"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1800&q=80')",
        }}
      >
        <div>
          <p className="uppercase tracking-[0.2em] text-xs text-white/85">Experience</p>
          <h1 className="font-playfair text-4xl md:text-6xl mt-2">Stay Beyond Ordinary</h1>
          <p className="mt-4 max-w-3xl text-white/90 leading-7">
            Discover curated experiences for every travel style, from luxury retreats
            and city breaks to family stays and business-friendly hotels.
          </p>
        </div>
      </div>

      <div className="px-4 md:px-16 lg:px-24 xl:px-32 mt-12 grid lg:grid-cols-4 md:grid-cols-2 gap-5">
        <img
          src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&q=80"
          alt="Infinity pool"
          className="rounded-2xl h-56 w-full object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&q=80"
          alt="Premium room"
          className="rounded-2xl h-56 w-full object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1000&q=80"
          alt="Modern interior"
          className="rounded-2xl h-56 w-full object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1455587734955-081b22074882?w=1000&q=80"
          alt="Hotel architecture"
          className="rounded-2xl h-56 w-full object-cover"
        />
      </div>

      <div className="px-4 md:px-16 lg:px-24 xl:px-32 mt-14">
        <h2 className="font-playfair text-3xl text-gray-900">Travel Categories</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {categories.map((item) => (
            <div key={item.title} className="border border-gray-200 rounded-xl overflow-hidden">
              <img src={item.image} alt={item.title} className="h-56 w-full object-cover" />
              <div className="p-6 bg-slate-50">
                <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                <p className="text-sm mt-2 text-gray-600 leading-6">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-16 lg:px-24 xl:px-32 mt-14">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            <h3 className="font-semibold text-gray-900">Included in your stay</h3>
            <ul className="mt-3 text-sm text-gray-600 space-y-2">
              <li>Free high-speed WiFi</li>
              <li>Complimentary breakfast options</li>
              <li>Flexible cancellation on select rooms</li>
              <li>24/7 customer assistance</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            <h3 className="font-semibold text-gray-900">Booking confidence</h3>
            <ul className="mt-3 text-sm text-gray-600 space-y-2">
              <li>Clear room details and amenities</li>
              <li>Discount offers at checkout</li>
              <li>Secure payment workflows</li>
              <li>Instant invoice generation</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            <h3 className="font-semibold text-gray-900">Personalized discovery</h3>
            <ul className="mt-3 text-sm text-gray-600 space-y-2">
              <li>City and budget based filters</li>
              <li>Search by destination and date</li>
              <li>Room and amenity based selections</li>
              <li>Recommended destinations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-16 lg:px-24 xl:px-32 mt-14">
        <h2 className="font-playfair text-3xl text-gray-900">What guests say</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div key={item.name} className="border border-gray-200 rounded-xl p-6 bg-slate-50">
              <p className="text-sm text-gray-600 leading-6">"{item.quote}"</p>
              <p className="font-semibold text-gray-900 mt-4">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-16 lg:px-24 xl:px-32 mt-14">
        <div
          className="rounded-2xl min-h-[320px] bg-cover bg-center p-8 md:p-12 text-white flex items-end"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=1800&q=80')",
          }}
        >
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl">Your next stay starts here</h2>
            <p className="mt-3 max-w-2xl text-white/90">
              Plan smarter with destination-rich discovery, tailored offers, and a booking
              journey designed for comfort at every step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
