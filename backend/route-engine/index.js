const express = require("express");
const axios = require("axios");
const cors = require("cors");
const polyline = require("@mapbox/polyline");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

console.log("🚀 Running from:", __filename);
console.log("💡 This is the file being executed");
console.log("🔑 ORS API KEY:", process.env.ORS_API_KEY);

// ✅ Route: POST /api/routes
app.post("/api/routes", async (req, res) => {
  console.log("🔥 /api/routes route hit");

  const { start, end, evStations, scenicSpots } = req.body;

  try {
    const shortest = await getRoute([start, end]);
    const mostEV = await getRoute([start, ...(evStations || []), end]);
    const scenic = await getRoute([start, ...(scenicSpots || []), end]);

    res.json({
      routes: [
        { type: "shortest", ...shortest, stops: 0 },
        { type: "most_ev", ...mostEV, stops: (evStations || []).length },
        { type: "scenic", ...scenic, stops: (scenicSpots || []).length },
      ],
    });
  } catch (err) {
    console.error("ORS Error:", err.message);
    res.status(500).json({ error: "Route fetch failed" });
  }
});

async function getRoute(coords) {
  const body = {
    coordinates: coords.map((p) => [p.lng, p.lat]),
  };

  console.log("📍 ORS Request Body:", JSON.stringify(body, null, 2));

  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      body,
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const route = response.data.routes[0];
    console.log("📦 ORS Response:", JSON.stringify(response.data, null, 2));

    return {
      eta: Math.round(route.summary.duration / 60), // ETA in minutes
      distance: (route.summary.distance / 1000).toFixed(2), // Distance in km
      geometry: decodePolyline(route.geometry), // Decoded coordinates
    };
  } catch (err) {
    console.error("❌ ORS FETCH ERROR:", err.message);
    throw err;
  }
}

function decodePolyline(encoded) {
  return polyline.decode(encoded).map(([lat, lng]) => ({ lat, lng }));
}

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
