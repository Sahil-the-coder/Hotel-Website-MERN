import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";

const MyHotels = () => {
  const { axios, getToken, user } = useAppContext();
  const [hotels, setHotels] = useState([]);

  const fetchOwnerHotels = async () => {
    try {
      const token = await getToken();
      // #region agent log
      fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"pre-fix",hypothesisId:"H1",location:"MyHotels.jsx:fetchOwnerHotels:start",message:"request-owner-hotels",data:{hasUser:Boolean(user),hasToken:Boolean(token)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      const { data } = await axios.get("/api/hotels/owner", {
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
      // #region agent log
      fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"pre-fix",hypothesisId:"H2",location:"MyHotels.jsx:fetchOwnerHotels:response",message:"owner-hotels-response",data:{success:data?.success,hotelsCount:Array.isArray(data?.hotels)?data.hotels.length:-1,message:data?.message || ""},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      if (data.success) {
        setHotels(data.hotels || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // #region agent log
      fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"pre-fix",hypothesisId:"H3",location:"MyHotels.jsx:fetchOwnerHotels:catch",message:"owner-hotels-request-failed",data:{errorMessage:error?.message || "",status:error?.response?.status || null,responseMessage:error?.response?.data?.message || ""},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      toast.error(
        error?.response?.data?.message ||
          "Unable to load your hotels. Please ensure backend is running."
      );
    }
  };

  useEffect(() => {
    if (user) fetchOwnerHotels();
  }, [user]);

  return (
    <div>
      <Title
        title="My Hotel Listings"
        subTitle="View your registered hotels and their listing details."
        align="left"
        font="outfit"
      />

      {hotels.length === 0 ? (
        <p className="mt-8 text-gray-500">
          No hotels found for your account yet. Register a hotel to see it here.
        </p>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 gap-6 max-w-5xl">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-800">{hotel.name}</h3>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">City:</span> {hotel.city}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Address:</span> {hotel.address}
              </p>
              {hotel.contact && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Contact:</span> {hotel.contact}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHotels;
