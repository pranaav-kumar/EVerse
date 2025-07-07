// File: src/user/StationMaintenance.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Generate hourly time slots from 6 AM to 11 PM
const generateFullDaySlots = () => {
  const slots = [];
  for (let hour = 6; hour < 23; hour++) {
    const start = new Date(0, 0, 0, hour, 0);
    const end = new Date(0, 0, 0, hour + 1, 0);
    const format = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    slots.push(`${format(start)} - ${format(end)}`);
  }
  return slots;
};

export default function StationMaintenance() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const station = state || { name: "Unknown Station", ports: 1 };

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const fullDaySlots = generateFullDaySlots();
  const portCount = parseInt(station.ports) || 1;

  const handleBooking = async () => {
    if (!selectedSlot) return alert("❌ Please select a slot first!");

    const bookingDetails = {
      stationName: station.name,
      slot: selectedSlot,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
      userEmail: "user1@example.com",
    };

    console.log("Booking confirmed:", bookingDetails);
    alert(` Booking Confirmed at ${station.name} for ${selectedSlot}`);
    try {
      await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails),
      });

      setBookedSlots(prev => [...prev, selectedSlot]);
      navigate("/payment", { state: bookingDetails });
    } catch (err) {
      alert("Booking failed. Try again.");
      console.error(err);
    }

  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await fetch(`http://localhost:5000/api/bookings/${station.name}/${today}`);
        const data = await res.json();
        const slots = data.map(booking => booking.slot);
        setBookedSlots(slots);
      } catch (err) {
        console.error("Failed to load booked slots:", err);
      }
    };
    fetchBookings();
  }, [station.name]);

  const openDirections = () => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${station.location?.lat},${station.location?.lng}`;
  window.open(url, "_blank");
};


  return (
    <div className="min-h-screen w-screen bg-zinc-900 text-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">
          EV Station: <span className="text-white">{station.name}</span>
        </h1>

        <h2 className="text-xl font-semibold mb-4 text-white">Available Slots</h2>

        {/* Repeat full slot list per port */}
        <div className="flex flex-col gap-10 mb-10">
          {Array.from({ length: portCount }, (_, portIndex) => (
            <div key={portIndex}>
              <h3 className="text-lg font-semibold mb-3 text-cyan-300">🔌 Port {portIndex + 1}</h3>
              <div className="flex flex-wrap gap-3">
                {fullDaySlots.map((slot, idx) => {
                  const slotKey = `P${portIndex + 1} ${slot}`; // Unique slot per port
                  const isBooked = bookedSlots.includes(slotKey);
                  return (
                    <button
                      key={slotKey}
                      onClick={() => !isBooked && setSelectedSlot(slotKey)}
                      className={`px-4 py-2 rounded-lg border transition-all font-medium text-sm ${
                        isBooked
                          ? "bg-red-600 text-white border-red-800 cursor-not-allowed opacity-50"
                          : selectedSlot === slotKey
                          ? "bg-cyan-500 text-white border-cyan-600"
                          : "bg-gray-700 text-white border-gray-600 hover:bg-cyan-700"
                      }`}
                      disabled={isBooked}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleBooking}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-full font-semibold shadow-lg"
          >
            ✅ Confirm Booking & Pay
          </button>

          <button
            onClick={openDirections}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-full font-semibold shadow-lg"
          >
            📍 Get Directions
          </button>
        </div>

        <div className="mt-10 text-sm text-gray-300">
          <p><span className="font-bold">Station Type:</span> {station.type?.join(", ") || "Charging"}</p>
          {station.ports && <p><span className="font-bold">Number of Ports:</span> {station.ports}</p>}
          {station.connectors && <p><span className="font-bold">Connector:</span> {station.connectors}</p>}
          {station.power && <p><span className="font-bold">Power:</span> {station.power} kW</p>}
        </div>
      </div>
    </div>
  );
}
