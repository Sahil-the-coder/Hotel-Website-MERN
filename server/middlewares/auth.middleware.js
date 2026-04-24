import User from "../models/user.model.js";

// Middleware to check if user is authenticated
const protect = async (req, res, next) => {
  const authFn = req.auth;
  const authData = typeof authFn === "function" ? authFn() : {};
  let userId = authData?.userId || null;
  if (!userId) {
    userId = req.headers["x-user-id"] || null;
  }
  // #region agent log
  fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"post-fix",hypothesisId:"H4",location:"auth.middleware.js:protect:entry",message:"protect-entry",data:{hasUserId:Boolean(userId),path:req.path,method:req.method,fromHeader:Boolean(req.headers["x-user-id"])},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  if (!userId) {
    // #region agent log
    fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"post-fix",hypothesisId:"H4",location:"auth.middleware.js:protect:no-user",message:"protect-rejected-no-user",data:{path:req.path},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return res.json({ success: false, message: "Not authenticated" });
  } else {
    let user = await User.findById(userId);
    // #region agent log
    fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"post-fix",hypothesisId:"H5",location:"auth.middleware.js:protect:user-lookup",message:"protect-user-lookup-result",data:{userExists:Boolean(user),userId},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (!user) {
      const username =
        req.headers["x-user-name"] || req.headers["x-user-username"] || "Guest User";
      const email = req.headers["x-user-email"] || `${userId}@quickstay.local`;
      const image = req.headers["x-user-image"] || "https://via.placeholder.com/150";
      user = await User.create({
        _id: userId,
        username,
        email,
        image,
        role: "user",
        recentSearchedCities: [],
      });
      // #region agent log
      fetch("http://127.0.0.1:7248/ingest/3623e882-1852-40eb-9d84-86e55ef48d22",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"post-fix",hypothesisId:"H5",location:"auth.middleware.js:protect:user-created",message:"fallback-user-created",data:{userId,hasEmail:Boolean(email),hasName:Boolean(username)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    }
    req.user = user;

    next();
  }
};

export default protect;
