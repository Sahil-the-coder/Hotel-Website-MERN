import { useState } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import Title from "../../components/Title";
import toast from "react-hot-toast";

const AddRoom = () => {
  const { axios, getToken, user } = useAppContext();

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free Wifi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Check if all inputs are filled
    if (
      !inputs.roomType ||
      !inputs.pricePerNight ||
      !inputs.amenities ||
      !Object.values(images).some((image) => image)
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      // #region agent log
      fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"post-fix",hypothesisId:"H8",location:"AddRoom.jsx:onSubmit:start",message:"add-room-submit",data:{hasToken:Boolean(token),hasUserId:Boolean(user?.id),imagesCount:Object.values(images).filter(Boolean).length},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      const formData = new FormData();
      formData.append("roomType", inputs.roomType);
      formData.append("pricePerNight", inputs.pricePerNight);
      // Converting amenities to array & keeping only enabled amenities
      const amenities = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );
      formData.append("amenities", JSON.stringify(amenities));
      // Adding images to form data
      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key]);
      });

      const { data } = await axios.post("/api/rooms/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-id": user?.id || "",
          "x-user-name": user?.fullName || user?.firstName || "Guest User",
          "x-user-email":
            user?.primaryEmailAddress?.emailAddress ||
            user?.emailAddresses?.[0]?.emailAddress ||
            "",
          "x-user-image": user?.imageUrl || "",
        },
      });
      if (data.success) {
        toast.success(data.message);
        setInputs({
          roomType: "",
          pricePerNight: 0,
          amenities: {
            "Free Wifi": false,
            "Free Breakfast": false,
            "Room Service": false,
            "Mountain View": false,
            "Pool Access": false,
          },
        });
        setImages({ 1: null, 2: null, 3: null, 4: null });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // #region agent log
      fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"post-fix",hypothesisId:"H8",location:"AddRoom.jsx:onSubmit:catch",message:"add-room-failed",data:{errorMessage:error?.message || "",status:error?.response?.status || null,responseMessage:error?.response?.data?.message || ""},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={onSubmitHandler}>
      <Title
        title="Add Room"
        subTitle="Fill in the details carefully and accurate room details, pricing, and amenities to enhance the user booking experience."
        align="left"
        font="Outfit"
      />
      {/* Upload Area for Images */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.uploadArea
              }
              alt="Upload area"
              className="max-h-13 cursor-pointer opacity-80"
            />
            <input
              onChange={(e) =>
                setImages({ ...images, [key]: e.target.files[0] })
              }
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
            />
          </label>
        ))}
      </div>

      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select
            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
            value={inputs.roomType}
            className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>
        <div>
          <p className="mt-4 text-gray-800">
            Price <span className="text-xs">/night</span>
          </p>
          <input
            type="number"
            onChange={(e) =>
              setInputs({ ...inputs, pricePerNight: e.target.value })
            }
            value={inputs.pricePerNight}
            placeholder="0"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
          />
        </div>
      </div>

      <p className="text-gray-800 mt-4">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index}>
            <input
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity],
                  },
                })
              }
              type="checkbox"
              id={`amenities${index + 1}`}
              checked={inputs.amenities[amenity]}
            />
            <label htmlFor={`amenities${index + 1}`}> {amenity}</label>
          </div>
        ))}
      </div>

      <button
        className="bg-primary hover:bg-primary-dull transition-all duration-300 text-white px-8 py-2 rounded mt-8 cursor-pointer"
        disabled={loading}
      >
        {loading ? "Adding Room..." : "Add Room"}
      </button>
    </form>
  );
};

export default AddRoom;
