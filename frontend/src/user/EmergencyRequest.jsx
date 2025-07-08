import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Zap, Car, MapPin, AlertTriangle } from "lucide-react";

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const EmergencyRequest = () => {
  const [position, setPosition] = useState(null);
  const [carModel, setCarModel] = useState("");
  const [chargerType, setChargerType] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [phone, setPhone] = useState("");
  const [batteryLevel, setBatteryLevel] = useState("");
  const [priority, setPriority] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [isPinMoved, setIsPinMoved] = useState(false);

  // Get location with high accuracy and 5s delay
  useEffect(() => {
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setMapReady(true);
        },
        (err) => {
          alert("Location access denied or unavailable.");
        },
        { enableHighAccuracy: true }
      );
    }, 5000);
  }, []);

  // Allow clicking on map to move pin
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        setIsPinMoved(true);
      },
    });
    return null;
  };

  const handleSubmit = () => {
    if (!position || !carModel || !chargerType || !requesterName || !phone || !batteryLevel || !priority) {
      alert("Please fill all fields.");
      return;
    }

    const data = {
      id: Date.now(),
      timestamp: new Date(),
      latitude: position[0],
      longitude: position[1],
      carModel,
      chargerType,
      requesterName,
      phone,
      batteryLevel: parseInt(batteryLevel),
      priority,
      status: "pending",
      location: `${position[0].toFixed(4)}, ${position[1].toFixed(4)}` // For now, using coordinates
    };

    console.log("Emergency request data:", data);
    alert("Emergency request sent successfully!");
    
    // Reset form
    setCarModel("");
    setChargerType("");
    setRequesterName("");
    setPhone("");
    setBatteryLevel("");
    setPriority("");
    setIsPinMoved(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-8 px-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              EV Emergency
            </h1>
          </div>
          <p className="text-xl text-blue-200 font-light">
            Fast charging assistance when you need it most
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/20 p-8">
          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-semibold text-blue-300">
                  <span>👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-700/50 border border-blue-500/30 text-white text-lg placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-semibold text-blue-300">
                  <span>📱</span>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-700/50 border border-blue-500/30 text-white text-lg placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-2">
              <Car className="w-6 h-6" />
              Vehicle Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-semibold text-blue-300">
                  <Car className="w-5 h-5" />
                  Vehicle Model
                </label>
                <select
                  className="w-full p-4 rounded-2xl bg-slate-700/50 border border-blue-500/30 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                >
                  <option value="" className="bg-slate-700">Select your EV</option>
                  <option value="Tesla Model 3" className="bg-slate-700">Tesla Model 3</option>
                  <option value="Nissan Leaf" className="bg-slate-700">Nissan Leaf</option>
                  <option value="Hyundai Ioniq 5" className="bg-slate-700">Hyundai Ioniq 5</option>
                  <option value="BMW iX" className="bg-slate-700">BMW iX</option>
                  <option value="Audi e-tron" className="bg-slate-700">Audi e-tron</option>
                  <option value="Mercedes EQS" className="bg-slate-700">Mercedes EQS</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-semibold text-blue-300">
                  <Zap className="w-5 h-5" />
                  Charger Type
                </label>
                <select
                  className="w-full p-4 rounded-2xl bg-slate-700/50 border border-blue-500/30 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  value={chargerType}
                  onChange={(e) => setChargerType(e.target.value)}
                >
                  <option value="" className="bg-slate-700">Select connector</option>
                  <option value="Type 1" className="bg-slate-700">Type 1 (J1772)</option>
                  <option value="Type 2" className="bg-slate-700">Type 2 (Mennekes)</option>
                  <option value="CCS" className="bg-slate-700">CCS (Combined)</option>
                  <option value="CHAdeMO" className="bg-slate-700">CHAdeMO</option>
                  <option value="Tesla Supercharger" className="bg-slate-700">Tesla Supercharger</option>
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Details Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-2">
              <span>🔋</span>
              Emergency Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-semibold text-blue-300">
                  <span>🔋</span>
                  Current Battery Level (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter battery percentage"
                  value={batteryLevel}
                  onChange={(e) => setBatteryLevel(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-700/50 border border-blue-500/30 text-white text-lg placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-semibold text-blue-300">
                  <AlertTriangle className="w-5 h-5" />
                  Priority Level
                </label>
                <select
                  className="w-full p-4 rounded-2xl bg-slate-700/50 border border-blue-500/30 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="" className="bg-slate-700">Select priority</option>
                  <option value="high" className="bg-slate-700">🔴 High - Critical (0-5% battery)</option>
                  <option value="medium" className="bg-slate-700">🟡 Medium - Urgent (6-15% battery)</option>
                  <option value="low" className="bg-slate-700">🟢 Low - Standard (16%+ battery)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-blue-300">
                Your Location
              </h3>
            </div>
            
            {!mapReady ? (
              <div className="h-96 rounded-2xl bg-slate-700/30 border border-blue-500/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-xl text-blue-200 font-light">
                    Locating your position...
                  </p>
                  <p className="text-sm text-blue-300/70 mt-2">
                    High accuracy GPS enabled
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-blue-500/30 shadow-2xl">
                <MapContainer
                  center={position}
                  zoom={15}
                  scrollWheelZoom={true}
                  style={{ height: "400px", width: "100%" }}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler />
                  <Marker
                    position={position}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e) => {
                        const { lat, lng } = e.target.getLatLng();
                        setPosition([lat, lng]);
                        setIsPinMoved(true);
                      },
                    }}
                  />
                </MapContainer>
                <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-blue-500/30">
                  <p className="text-sm text-blue-200">
                    📍 Drag marker or click to adjust location
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          {isPinMoved && (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold text-lg rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-red-400/50"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 group-hover:animate-pulse" />
                  <span>Send Emergency Request</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>
          )}

          {/* Status indicator */}
          {!isPinMoved && mapReady && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Position confirmed - Move pin to enable request</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-300/60">
          <p className="text-sm">
            🔋 Emergency charging assistance available 24/7
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequest;