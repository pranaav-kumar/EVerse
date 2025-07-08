import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker icons
const startIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 40],
});

const endIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [30, 40],
});

const tempIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [28, 38],
});

const stationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/17310/17310029.png",
  iconSize: [22, 22],
});

// Static EV stations
const stations = [ // Only sample listed
  { lat: 13.0664462, lng: 80.2695916 },
  { lat: 13.067525, lng: 80.2519303 },
  { lat: 13.0701, lng: 80.2455 },
  { lat: 13.0451, lng: 80.2103 },
  { lat: 13.0878, lng: 80.2785 },
  { lat: 12.9716, lng: 80.2436 },
  { lat: 13.0569, lng: 80.2091 },
  { lat: 13.0475, lng: 80.2572 },
  { lat: 13.0199, lng: 80.2357 },
  { lat: 13.1067, lng: 80.2099 },
  { lat: 13.04654, lng: 80.0794682 },
  { lat: 12.8679494, lng: 80.076113 },
  { lat: 12.9453463, lng: 79.2006151 },
  { lat: 12.9165, lng: 79.1325 },
  { lat: 11.0403462, lng: 77.040949 },
  { lat: 10.8629236, lng: 76.872977 },
  { lat: 11.0168, lng: 76.9558 },
  { lat: 11.051, lng: 76.9339 },
  { lat: 10.9601, lng: 76.9702 },
  { lat: 9.4678754, lng: 77.5658912 },
  { lat: 12.2525098, lng: 79.0695341 },
  { lat: 12.2401657, lng: 79.6624831 },
  { lat: 9.9252, lng: 78.1198 },
  { lat: 9.9173, lng: 78.1242 },
  { lat: 11.6643, lng: 78.146 },
  { lat: 11.6796, lng: 78.139 },
  { lat: 10.7905, lng: 78.7047 },
  { lat: 10.8155, lng: 78.6945 },
  { lat: 11.341, lng: 77.7172 },
  { lat: 8.7139, lng: 77.7567 },
  { lat: 8.0883, lng: 77.5385 },
  { lat: 11.4064, lng: 76.6932 },
  { lat: 12.7409, lng: 77.8253 },
  { lat: 12.8185, lng: 79.7055 },
  { lat: 10.787, lng: 79.1378 },
  { lat: 10.3673, lng: 77.9803 },
  { lat: 10.9601, lng: 78.0766 },
  { lat: 11.7449, lng: 79.7689 },
  { lat: 10.7677, lng: 79.8448 },
  { lat: 10.3833, lng: 78.8167 },
  { lat: 12.5186, lng: 78.2137 },
  { lat: 12.1211, lng: 78.1583 },
  { lat: 9.8433, lng: 78.4811 },
  { lat: 9.3763, lng: 78.8349 },
  { lat: 10.0104, lng: 77.4977 },
  { lat: 9.581, lng: 77.9624 },
  { lat: 11.2189, lng: 78.1677 },
  { lat: 11.3524, lng: 76.7959 },
  { lat: 11.1401, lng: 79.0757 },
  { lat: 11.2342, lng: 78.8964 },
  { lat: 8.7642, lng: 78.1348 },
];

function MapSearch({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 16);
  }, [position, map]);
  return null;
}

const ClickLocation = ({ mode, setTemp }) => {
  useMapEvents({
    click(e) {
      setTemp(e.latlng);
    },
  });
  return null;
};

const reverseGeocode = async (lat, lon) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
  const data = await res.json();
  return data.display_name || "Unknown Location";
};

const handleSearch = async (query, setMapCenter, setTempLocation, setSearchMarker, setTempName) => {
  if (!query) return;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const newCenter = [parseFloat(lat), parseFloat(lon)];
      setMapCenter(newCenter);
      setTempLocation({ lat: newCenter[0], lng: newCenter[1] });
      setTempName(display_name);
      setSearchMarker(newCenter);
      if (window.leafletMap) {
        window.leafletMap.setView(newCenter, 16);
      }
    } else {
      alert("No results found!");
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
  }
};

const RoutePlanner = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");

  const [tempLocation, setTempLocation] = useState(null);
  const [tempName, setTempName] = useState("");
  const [searchMarker, setSearchMarker] = useState(null);
  const [mode, setMode] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [query, setQuery] = useState("");

  const [shortestRoute, setShortestRoute] = useState([]);
  const [evRoute, setEvRoute] = useState([]);

  const confirmLocation = async () => {
    if (!tempLocation) return;
    const { lat, lng } = tempLocation;
    const address = tempName || await reverseGeocode(lat, lng);

    if (mode === "start") {
      setStart(tempLocation);
      setStartAddress(address);
    } else if (mode === "end") {
      setEnd(tempLocation);
      setEndAddress(address);
    }

    setMode(null);
    setTempLocation(null);
    setTempName("");
    setSearchMarker(null);
  };

  useEffect(() => {
    if (!start || !end) return;

    fetch("http://127.0.0.1:8000/ev_prediction_full", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start, end }),
    })
      .then((res) => res.json())
      .then((data) => {
        const shortestCoords = data.shortest_route?.features[0]?.geometry?.coordinates || [];
        const evCoords = data.ev_station_route?.features[0]?.geometry?.coordinates || [];

        setShortestRoute(shortestCoords.map(([lng, lat]) => [lat, lng]));
        setEvRoute(evCoords.map(([lng, lat]) => [lat, lng]));
      })
      .catch((err) => {
        console.error("Route fetch failed", err);
      });
  }, [start, end]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1e3a5f] to-[#0d1b2a] text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Plan Your Trip
          </h1>
          <p className="text-gray-300 text-lg">Smart route planning for electric vehicles</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700/50">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder=" Search location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-gray-900/70 text-white border border-gray-600/50"
            />
            <button
              onClick={() => handleSearch(query, setMapCenter, setTempLocation, setSearchMarker, setTempName)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-semibold"
            >
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => setMode("start")} className="px-6 py-3 rounded-xl bg-green-600 font-semibold">
              Choose Start
            </button>
            <button onClick={() => setMode("end")} className="px-6 py-3 rounded-xl bg-red-600 font-semibold">
              Choose End
            </button>
            {tempLocation && mode && (
              <button onClick={confirmLocation} className="px-6 py-3 bg-yellow-500 rounded-xl font-semibold">
                Confirm Location
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700/50">
          <MapContainer
            center={mapCenter}
            zoom={6}
            style={{ height: "450px", borderRadius: "16px" }}
            whenCreated={(map) => (window.leafletMap = map)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />
            <MapSearch position={mapCenter} />
            {mode && <ClickLocation mode={mode} setTemp={setTempLocation} />}
            {start && <Marker position={start} icon={startIcon} />}
            {end && <Marker position={end} icon={endIcon} />}
            {tempLocation && mode && <Marker position={tempLocation} icon={tempIcon} />}
            {stations.map((s, i) => (
              <Marker key={i} position={[s.lat, s.lng]} icon={stationIcon} />
            ))}
            {shortestRoute.length > 0 && <Polyline positions={shortestRoute} color="blue" />}
            {evRoute.length > 0 && <Polyline positions={evRoute} color="green" />}
          </MapContainer>
        </div>

        {(startAddress || endAddress) && (
          <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700/50">
            <h3 className="text-xl font-semibold mb-4 text-center">Selected Locations</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {startAddress && (
                <div className="bg-green-900/30 p-4 rounded-xl">
                  <p className="font-semibold text-green-400">Start</p>
                  <p className="text-sm text-white">{startAddress}</p>
                </div>
              )}
              {endAddress && (
                <div className="bg-red-900/30 p-4 rounded-xl">
                  <p className="font-semibold text-red-400">End</p>
                  <p className="text-sm text-white">{endAddress}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;
