import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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

  const openGoogleMaps = () => {
    if (start && end) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}`;
      window.open(url, '_blank');
    } else {
      alert("Please set both start and end locations.");
    }
  };

  const calculateRouteData = () => {
    if (!start || !end) return null;
    const latDiff = Math.abs(start.lat - end.lat);
    const lngDiff = Math.abs(start.lng - end.lng);
    const baseTime = 4.5;
    const factor = latDiff + lngDiff;
    return [
      {
        label: "Most EV Stations",
        time: `${(baseTime + factor * 2).toFixed(2)} hr`,
        stops: 4,
        wait: "45 mins",
        color: "from-emerald-500 to-teal-600",
      },
      {
        label: "Shortest Path",
        time: `${(baseTime + factor).toFixed(2)} hr`,
        stops: 2,
        wait: "20 mins",
        color: "from-blue-500 to-indigo-600",
      },
      {
        label: "Scenic Route",
        time: `${(baseTime + factor * 2.5).toFixed(2)} hr`,
        stops: 3,
        sights: 5,
        color: "from-purple-500 to-pink-600",
      }
    ];
  };

  const routeOptions = calculateRouteData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1e3a5f] to-[#0d1b2a] text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Plan Your Trip
          </h1>
          <p className="text-gray-300 text-lg">Smart route planning for electric vehicles</p>
        </div>

        {/* Search Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder=" Search for any location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-gray-900/70 text-white border border-gray-600/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
              />
            </div>
            <button
              onClick={() => handleSearch(query, setMapCenter, setTempLocation, setSearchMarker, setTempName)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-blue-500/25 text-lg"
            >
              Search
            </button>
          </div>

          {/* Location Selection Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setMode("start")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                mode === "start" 
                  ? "bg-gradient-to-r from-green-600 to-green-700 shadow-green-500/25" 
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-green-500/25"
              }`}
            >
                Choose Start Location
            </button>
            <button
              onClick={() => setMode("end")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                mode === "end" 
                  ? "bg-gradient-to-r from-red-600 to-red-700 shadow-red-500/25" 
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/25"
              }`}
            >
                Choose End Location
            </button>
            {tempLocation && mode && (
              <button
                onClick={confirmLocation}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl hover:from-yellow-600 hover:to-orange-600 font-semibold transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 animate-pulse"
              >
                  Confirm Location
              </button>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
          <MapContainer
            center={mapCenter}
            zoom={5}
            style={{ 
              height: "450px", 
              borderRadius: "16px", 
              border: "2px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
            }}
            whenCreated={(map) => (window.leafletMap = map)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <MapSearch position={mapCenter} />
            {mode && <ClickLocation mode={mode} setTemp={setTempLocation} />}
            {start && <Marker position={start} icon={startIcon} />} 
            {end && <Marker position={end} icon={endIcon} />} 
            {tempLocation && mode && <Marker position={tempLocation} icon={tempIcon} />}
          </MapContainer>
        </div>

        {/* Selected Locations Display */}
        {(startAddress || endAddress) && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
            <h3 className="text-xl font-semibold mb-4 text-center"> Selected Locations</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {startAddress && (
                <div className="bg-green-900/30 border border-green-600/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl"></span>
                    <div>
                      <p className="font-semibold text-green-400">Start Location</p>
                      <p className="text-sm text-gray-300">{startAddress}</p>
                    </div>
                  </div>
                </div>
              )}
              {endAddress && (
                <div className="bg-red-900/30 border border-red-600/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl"></span>
                    <div>
                      <p className="font-semibold text-red-400">End Location</p>
                      <p className="text-sm text-gray-300">{endAddress}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Smart Route Suggestions */}
        {routeOptions && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 text-center"> Smart Route Suggestions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {routeOptions.map((route, index) => (
                <div
                  key={index}
                  onClick={openGoogleMaps}
                  className="group relative bg-gray-900/70 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700/50 hover:border-blue-500/50 overflow-hidden"
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${route.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{route.icon}</span>
                      <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
                        {route.label}
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">⏱</span>
                        <span className="text-gray-300">Time: <span className="font-semibold text-white">{route.time}</span></span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-green-400"></span>
                        <span className="text-gray-300">Stops: <span className="font-semibold text-white">{route.stops}</span></span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {route.label === "Scenic Route" ? (
                          <>
                            <span className="text-purple-400"></span>
                            <span className="text-gray-300">Sights: <span className="font-semibold text-white">{route.sights}</span></span>
                          </>
                        ) : (
                          <>
                            <span className="text-yellow-400"></span>
                            <span className="text-gray-300">Wait: <span className="font-semibold text-white">{route.wait}</span></span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm text-blue-300 font-semibold">Click to open in Google Maps →</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;