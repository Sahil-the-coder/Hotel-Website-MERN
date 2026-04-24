const stats = [
  { label: "Hotels Listed", value: "480+" },
  { label: "Cities Covered", value: "45+" },
  { label: "Happy Bookings", value: "25k+" },
  { label: "Avg. Guest Rating", value: "4.8/5" },
];

const timeline = [
  {
    year: "2021",
    title: "QuickStay started",
    description:
      "We launched with a small set of city hotels and a mission to make booking effortless.",
  },
  {
    year: "2022",
    title: "Owner platform launched",
    description:
      "Hotel owners got room management, revenue tracking, and instant booking visibility.",
  },
  {
    year: "2024",
    title: "Global destinations expanded",
    description:
      "Expanded into major international destinations with curated premium and budget stays.",
  },
  {
    year: "2026",
    title: "Smart offers and invoice flow",
    description:
      "Introduced dynamic offers, smoother checkout, and improved invoice-ready experiences.",
  },
];

const About = () => {
  return (
    <div className="pt-24 pb-20 text-gray-700 bg-gradient-to-b from-slate-50 to-white">
      <div
        className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 rounded-2xl min-h-[430px] bg-cover bg-center text-white p-8 md:p-14 flex flex-col justify-end"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1455587734955-081b22074882?w=1800&q=80')",
        }}
      >
        <p className="uppercase tracking-[0.2em] text-xs text-white/85">About QuickStay</p>
        <h1 className="font-playfair text-4xl md:text-6xl mt-2">
          Making Every Stay Better
        </h1>
        <p className="mt-4 max-w-3xl text-white/90 leading-7">
          QuickStay brings design, trust, and convenience into one platform where
          travelers discover great stays and hotel owners grow with confidence.
        </p>
      </div>

      <div className="px-4 md:px-16 lg:px-24 xl:px-32 mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm"
          >
            <p className="text-3xl font-semibold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 md:px-16 lg:px-24 xl:px-32 mt-14 grid lg:grid-cols-2 gap-10 items-center">
        <img
          src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80"
          alt="Hotel reception"
          className="rounded-2xl shadow-md object-cover w-full h-[460px]"
        />
        <div>
          <h2 className="font-playfair text-3xl text-gray-900">Our Story</h2>
          <p className="mt-4 leading-7 text-gray-600">
            We started with one focus: booking should be as good as the stay itself.
            From search to payment and invoice, every step is designed to reduce friction
            and increase confidence.
          </p>
          <p className="mt-4 leading-7 text-gray-600">
            Today, QuickStay helps guests discover curated destinations and enables hotel
            owners to manage inventory, offers, and reservations in one integrated flow.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&q=80"
              alt="Luxury room"
              className="rounded-xl h-32 w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&q=80"
              alt="Hotel exterior"
              className="rounded-xl h-32 w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="px-4 md:px-16 lg:px-24 xl:px-32 mt-14">
        <h2 className="font-playfair text-3xl text-gray-900">Our Journey</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {timeline.map((step) => (
            <div key={step.year} className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-sm font-semibold text-primary">{step.year}</p>
              <h3 className="text-xl font-semibold text-gray-900 mt-1">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-6">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-16 lg:px-24 xl:px-32 mt-14 grid md:grid-cols-3 gap-6">
        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="font-semibold text-lg text-gray-900">Secure Payments</h3>
          <p className="text-sm mt-2 text-gray-600">
            Protected checkout and clear pricing for every booking.
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="font-semibold text-lg text-gray-900">Verified Properties</h3>
          <p className="text-sm mt-2 text-gray-600">
            Listings with quality standards and transparent amenities.
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="font-semibold text-lg text-gray-900">Owner Tools</h3>
          <p className="text-sm mt-2 text-gray-600">
            Powerful tools for inventory, offers, bookings, and revenue monitoring.
          </p>
        </div>
      </div>

      <div className="px-4 md:px-16 lg:px-24 xl:px-32 mt-14">
        <div
          className="rounded-2xl p-8 md:p-12 text-white bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?w=1800&q=80')",
          }}
        >
          <h2 className="font-playfair text-3xl md:text-4xl">Ready for your next stay?</h2>
          <p className="mt-3 max-w-3xl text-white/90">
            Explore city hotels, luxury retreats, family stays, and exclusive offers built
            for every type of traveler.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
