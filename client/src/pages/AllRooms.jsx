import { assets, facilityIcons } from "../assets/assets";
import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import StarRating from "../components/StarRating";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        onChange={(e) => onChange(e.target.checked, label)}
        type="checkbox"
        checked={selected}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        onChange={() => onChange(label)}
        type="radio"
        name="sortOption"
        checked={selected}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const { rooms, navigate, currency } = useAppContext();

  const [openFilters, setOpenFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
    city: [],
  });
  const [selectedSort, setSelectedSort] = useState("");
  const destinationParam = searchParams.get("destination") || "";
  const checkInParam = searchParams.get("checkIn") || "";
  const checkOutParam = searchParams.get("checkOut") || "";
  const guestsParam = searchParams.get("guests") || "";
  const [searchForm, setSearchForm] = useState({
    destination: destinationParam,
    checkIn: checkInParam,
    checkOut: checkOutParam,
    guests: guestsParam || "1",
  });
  useEffect(() => {
    setSearchForm({
      destination: destinationParam,
      checkIn: checkInParam,
      checkOut: checkOutParam,
      guests: guestsParam || "1",
    });
  }, [destinationParam, checkInParam, checkOutParam, guestsParam]);

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = [
    "2000 to 5000",
    "5000 to 10000",
    "10000 to 20000",
    "20000 to 30000",
    "30000 to 100000",
  ];
  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];
  const cities = useMemo(
    () => [...new Set(rooms.map((room) => room.hotel.city))].sort(),
    [rooms]
  );

  // Handle changes for filters and sorting
  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (checked) {
        updatedFilters[type].push(value);
      } else {
        updatedFilters[type] = updatedFilters[type].filter(
          (item) => item !== value
        );
      }
      return updatedFilters;
    });
  };

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };

  // Function to check if a room mataches the selected room types
  const matachesRoomType = (room) => {
    return (
      selectedFilters.roomType.length === 0 ||
      selectedFilters.roomType.includes(room.roomType)
    );
  };

  // Function to check if a room mataches the selected price ranges
  const matachesPriceRange = (room) => {
    return (
      selectedFilters.priceRange.length === 0 ||
      selectedFilters.priceRange.some((range) => {
        const [min, max] = range.split(" to ").map(Number);
        return room.pricePerNight >= min && room.pricePerNight <= max;
      })
    );
  };

  const matchesCity = (room) => {
    return (
      selectedFilters.city.length === 0 || selectedFilters.city.includes(room.hotel.city)
    );
  };

  // Function to sort rooms based on the selected sort option
  const sortRooms = (a, b) => {
    if (selectedSort === "Price Low to High") {
      return a.pricePerNight - b.pricePerNight;
    }
    if (selectedSort === "Price High to Low") {
      return b.pricePerNight - a.pricePerNight;
    }
    if (selectedSort === "Newest First") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  };

  // Filter Destination
  const filterDestination = (room) => {
    const destination = searchParams.get("destination");
    if (!destination) return true;
    return room.hotel.city
      .toLowerCase()
      .includes(destination.toLocaleLowerCase());
  };

  // Filter and sort rooms based on the selected filters and sort option
  const filteredRooms = useMemo(() => {
    return rooms
      .filter(
        (room) =>
          matachesRoomType(room) &&
          matachesPriceRange(room) &&
          matchesCity(room) &&
          filterDestination(room)
      )
      .sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, searchParams]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      roomType: [],
      priceRange: [],
      city: [],
    });
    setSelectedSort("");
    setSearchParams({
      destination: "",
      checkIn: "",
      checkOut: "",
      guests: "1",
    });
    setSearchForm({
      destination: "",
      checkIn: "",
      checkOut: "",
      guests: "1",
    });
  };

  const applySearchFilters = (e) => {
    e.preventDefault();
    const params = {};
    if (searchForm.destination) params.destination = searchForm.destination;
    if (searchForm.checkIn) params.checkIn = searchForm.checkIn;
    if (searchForm.checkOut) params.checkOut = searchForm.checkOut;
    if (searchForm.guests) params.guests = searchForm.guests;
    setSearchParams(params);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32">
      <div>
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memoris.
          </p>
          <p className="text-sm md:text-base font-medium text-gray-700 mt-3">
            Total Hotels: {rooms.length} | Showing: {filteredRooms.length}
          </p>
        </div>

        <form
          onSubmit={applySearchFilters}
          className="mt-6 grid md:grid-cols-5 gap-3 bg-white border border-gray-200 rounded-xl p-4"
        >
          <input
            value={searchForm.destination}
            onChange={(e) =>
              setSearchForm((prev) => ({ ...prev, destination: e.target.value }))
            }
            placeholder="Destination"
            className="border border-gray-200 rounded px-3 py-2 text-sm outline-none"
          />
          <input
            type="date"
            value={searchForm.checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setSearchForm((prev) => ({ ...prev, checkIn: e.target.value }))
            }
            className="border border-gray-200 rounded px-3 py-2 text-sm outline-none"
          />
          <input
            type="date"
            value={searchForm.checkOut}
            min={searchForm.checkIn || new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setSearchForm((prev) => ({ ...prev, checkOut: e.target.value }))
            }
            className="border border-gray-200 rounded px-3 py-2 text-sm outline-none"
          />
          <input
            type="number"
            min={1}
            max={8}
            value={searchForm.guests}
            onChange={(e) =>
              setSearchForm((prev) => ({ ...prev, guests: e.target.value }))
            }
            className="border border-gray-200 rounded px-3 py-2 text-sm outline-none"
          />
          <button className="bg-primary text-white rounded px-4 py-2 text-sm cursor-pointer">
            Update Search
          </button>
        </form>

        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
          >
            <img
              onClick={() => {
                const detailsParams = new URLSearchParams({
                  destination: destinationParam,
                  checkIn: checkInParam,
                  checkOut: checkOutParam,
                  guests: guestsParam || "1",
                });
                navigate(`/rooms/${room._id}?${detailsParams.toString()}`);
                scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt="Hotel"
              title="View Room Details"
              className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
            />

            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.hotel.city}</p>
              <p
                onClick={() => {
                  const detailsParams = new URLSearchParams({
                    destination: destinationParam,
                    checkIn: checkInParam,
                    checkOut: checkOutParam,
                    guests: guestsParam || "1",
                  });
                  navigate(`/rooms/${room._id}?${detailsParams.toString()}`);
                  scrollTo(0, 0);
                }}
                className="text-gray-800 text-3xl font-playfair cursor-pointer"
              >
                {room.hotel.name}
              </p>
              <div className="flex items-centers">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="Location" />
                <span>{room.hotel.address}</span>
              </div>
              {/* Room Amenities */}
              <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-[#F5F5FF]/70 px-3 py-2 rounded-lg"
                  >
                    <img
                      src={facilityIcons[item]}
                      alt={item}
                      className="w-5 h-5"
                    />
                    <p className="text-xs">{item}</p>
                  </div>
                ))}
              </div>
              {/* Room Price per Night */}
              <p className="text-xl font-medium text-gray-700">
                {currency}
                {room.pricePerNight} /night
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16">
        <div
          className={`flex items-center justify-between px-5 py-2.5 lg:border-b border-r-gray-300 ${
            openFilters && "border-b"
          }`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span onClick={clearFilters} className="hidden lg:block">
              CLEAR
            </span>
          </div>
        </div>

        <div
          className={`${
            openFilters ? "h-auto" : "h-0 lg:h-auto"
          } overflow-hidden transition-all duration-700`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room}
                selected={selectedFilters.roomType.includes(room)}
                onChange={(checked) =>
                  handleFilterChange(checked, room, "roomType")
                }
              />
            ))}
          </div>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Cities</p>
            {cities.map((city, index) => (
              <CheckBox
                key={index}
                label={city}
                selected={selectedFilters.city.includes(city)}
                onChange={(checked) => handleFilterChange(checked, city, "city")}
              />
            ))}
          </div>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={`${currency} ${range}`}
                selected={selectedFilters.priceRange.includes(range)}
                onChange={(checked) =>
                  handleFilterChange(checked, range, "priceRange")
                }
              />
            ))}
          </div>
          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSort === option}
                onChange={() => handleSortChange(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
