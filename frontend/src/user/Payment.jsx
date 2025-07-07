// File: src/user/Payment.jsx
import React from "react";
import { useLocation } from "react-router-dom";

export default function Payment() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <p className="text-xl text-red-500">⚠️ No booking information provided.</p>
      </div>
    );
  }

  const { stationName, slot, timestamp } = state;

  const handlePayment = () => {
    alert("🧾 Payment would be processed here (Razorpay or UPI)");
    // You can replace this with Razorpay integration logic later
  };

  return (
    <div className="min-h-screen w-full bg-zinc-900 text-white flex flex-col items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-cyan-400 mb-4">Payment Summary</h1>
        <p className="mb-2"><span className="font-semibold">📍 Station:</span> {stationName}</p>
        <p className="mb-2"><span className="font-semibold">🕒 Slot:</span> {slot}</p>
        <p className="mb-4"><span className="font-semibold">📅 Booked At:</span> {new Date(timestamp).toLocaleString()}</p>

        <button
          onClick={handlePayment}
          className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          💳 Proceed to Payment
        </button>
      </div>
    </div>
  );
}
