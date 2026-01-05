const allowedOrigins = require("./allowed_origins");

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Port is authorized", origin);
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed  by CORS"));
    }
  },
  credentials: true,
};

module.exports = corsOptions;
