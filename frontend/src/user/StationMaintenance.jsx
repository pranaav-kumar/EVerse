// File: src/pages/user/StationMaintenance.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const availableSlots = [
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
];

export default function StationMaintenance() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const station = state || { name: "Unknown Station" };
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleBooking = () => {
    if (!selectedSlot) return alert("Please select a slot first!");
    const bookingDetails = {
      stationName: station.name,
      slot: selectedSlot,
      timestamp: new Date().toISOString(),
    };
    console.log("Booking confirmed:", bookingDetails);
    alert(` Booking Confirmed at ${station.name} for ${selectedSlot}`);
  };

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen w-screen bg-zinc-900 text-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">
          EV Station: <span className="text-white">{station.name}</span>
        </h1>

        <h2 className="text-xl font-semibold mb-4 text-white">Available Slots</h2>
        <div className="flex flex-wrap gap-4 mb-8">
          {availableSlots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSlot(slot)}
              className={`px-4 py-2 rounded-lg border transition-all font-medium text-sm ${
                selectedSlot === slot
                  ? "bg-cyan-500 text-white border-cyan-600"
                  : "bg-gray-700 text-white border-gray-600 hover:bg-cyan-700"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleBooking}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-full font-semibold shadow-lg"
          >
            ✅ Confirm Booking
          </button>

          <button
            onClick={openDirections}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-full font-semibold shadow-lg"
          >
            📍 Get Directions
          </button>
        </div>

        {/* Optional Extra Info */}
        <div className="mt-10 text-sm text-gray-300">
          <p><span className="font-bold">Station Type:</span> {station.type === "swap" ? "Battery Swap" : "Charging"}</p>
          {station.availableSlots && (
            <p><span className="font-bold">Available Slots:</span> {station.availableSlots}</p>
          )}
          {station.waitTime && (
            <p><span className="font-bold">Current Wait Time:</span> {station.waitTime}</p>
          )}
          {station.availableBatteries && (
            <p><span className="font-bold">Available Batteries:</span> {station.availableBatteries}</p>
          )}
          {station.batteryTypes && (
            <p><span className="font-bold">Battery Types:</span> {station.batteryTypes.join(", ")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
