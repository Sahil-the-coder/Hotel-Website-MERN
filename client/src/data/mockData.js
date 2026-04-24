const citySeeds = [
  ["Mumbai", "India"],
  ["Delhi", "India"],
  ["Bengaluru", "India"],
  ["Jaipur", "India"],
  ["Goa", "India"],
  ["Pune", "India"],
  ["Dubai", "UAE"],
  ["Abu Dhabi", "UAE"],
  ["Singapore", "Singapore"],
  ["London", "UK"],
  ["Paris", "France"],
  ["Rome", "Italy"],
  ["New York", "USA"],
  ["Los Angeles", "USA"],
  ["Toronto", "Canada"],
  ["Vancouver", "Canada"],
  ["Tokyo", "Japan"],
  ["Kyoto", "Japan"],
  ["Seoul", "South Korea"],
  ["Bangkok", "Thailand"],
  ["Sydney", "Australia"],
  ["Melbourne", "Australia"],
  ["Berlin", "Germany"],
  ["Madrid", "Spain"],
  ["Barcelona", "Spain"],
  ["Cape Town", "South Africa"],
  ["Istanbul", "Turkey"],
  ["Doha", "Qatar"],
  ["Amsterdam", "Netherlands"],
  ["Zurich", "Switzerland"],
  ["Kolkata", "India"],
  ["Chennai", "India"],
  ["Hyderabad", "India"],
  ["Kochi", "India"],
  ["San Francisco", "USA"],
  ["Chicago", "USA"],
  ["Mexico City", "Mexico"],
  ["Lisbon", "Portugal"],
  ["Vienna", "Austria"],
  ["Prague", "Czech Republic"],
  ["Athens", "Greece"],
  ["Osaka", "Japan"],
  ["Auckland", "New Zealand"],
  ["Riyadh", "Saudi Arabia"],
  ["Muscat", "Oman"],
];

const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
const amenitiesOptions = [
  ["Free Wifi", "Room Service", "Pool Access"],
  ["Free Wifi", "Free Breakfast", "Mountain View"],
  ["Room Service", "Free Breakfast", "Pool Access"],
  ["Free Wifi", "Room Service", "Free Breakfast"],
];

const imagePool = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
];

const hotelNamePrefix = [
  "Royal",
  "Emerald",
  "Bluewave",
  "Golden",
  "Skyline",
  "Urban",
  "Palm",
  "Opal",
  "Regal",
  "Sunset",
  "Harbor",
  "Imperial",
];

const hotelNameSuffix = [
  "Residency",
  "Retreat",
  "Suites",
  "Plaza",
  "Heights",
  "Grand",
  "Haven",
  "Crown",
  "Palace",
  "Collection",
  "Inn",
  "Vista",
];

const buildRoom = (index) => {
  const [city, country] = citySeeds[index % citySeeds.length];
  const hotelNumber = Math.floor(index / citySeeds.length) + 1;
  const isIndia = country === "India";
  const minPrice = isIndia ? 2000 : 10000;
  const maxPrice = isIndia ? 10000 : 30000;
  const band = maxPrice - minPrice;
  const priceBase = minPrice + ((index * 997 + hotelNumber * 431) % band);
  const id = `mock-room-${index + 1}`;
  const prefix = hotelNamePrefix[(index + hotelNumber) % hotelNamePrefix.length];
  const suffix =
    hotelNameSuffix[(index * 3 + hotelNumber) % hotelNameSuffix.length];
  const nameVariant = String.fromCharCode(65 + (index % 26));

  return {
    _id: id,
    hotel: {
      _id: `mock-hotel-${index + 1}`,
      name: `${prefix} ${city} ${suffix} ${nameVariant}`,
      address: `${18 + index} ${city} Central Avenue, ${country}`,
      city,
      country,
    },
    roomType: roomTypes[index % roomTypes.length],
    pricePerNight: priceBase,
    amenities: amenitiesOptions[index % amenitiesOptions.length],
    images: [
      imagePool[index % imagePool.length],
      imagePool[(index + 1) % imagePool.length],
      imagePool[(index + 2) % imagePool.length],
      imagePool[(index + 3) % imagePool.length],
    ],
    isAvailable: true,
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  };
};

export const mockRooms = Array.from({ length: 480 }, (_, i) => buildRoom(i));

export const mockCities = Array.from(
  new Set(citySeeds.map(([city]) => city))
);
