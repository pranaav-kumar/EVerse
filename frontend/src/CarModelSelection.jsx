// src/user/CarModelSelection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const carModels = [
  { model: "BYD Atto 3", battery: "49.9–60.5 kWh", range: "468–521 km" },
  { model: "BYD E6", battery: "71.7 kWh", range: "≈520 km" },
  { model: "BYD Seal", battery: "61.4–82.6 kWh", range: "510–650 km" },
  { model: "Citroën eC3", battery: "29.2 kWh", range: "320 km" },
  { model: "Hyundai Creta Electric", battery: "42–51.4 kWh", range: "390–473 km" },
  { model: "Kia EV6", battery: "77.4 kWh", range: "528–663 km" },
  { model: "Mahindra BE 6", battery: "59 or 79 kWh", range: "557–682 km" },
  { model: "Mahindra XEV 9e", battery: "59 or 79 kWh", range: "542–656 km" },
  { model: "Mahindra XUV400 EV", battery: "34.5 or 39.4 kWh", range: "375–456 km" },
  { model: "MG ZS EV", battery: "50.3 kWh", range: "461 km" },
  { model: "MG Windsor EV", battery: "38–52.9 kWh", range: "332–449 km" },
  { model: "Tata Curvv EV", battery: "45 or 55 kWh", range: "502–585 km" },
  { model: "Tata Harrier EV", battery: "65 or 75 kWh", range: "Up to 627 km" },
  { model: "Tata Nexon EV", battery: "30–46.1 kWh", range: "275–489 km" },
  { model: "Tata Punch EV", battery: "25–35 kWh", range: "315–421 km" },
  { model: "Tata Tiago EV", battery: "19.2 or 24 kWh", range: "250–315 km" },
  { model: "Tata Tigor EV", battery: "26 kWh", range: "315 km" },
  { model: "Hyundai Kona Electric", battery: "39.2 kWh", range: "≈452 km" },
  { model: "Mercedes-Benz EQS", battery: "107.8 kWh", range: "~857 km" },
  { model: "BMW i7", battery: "101.7 kWh", range: "~625 km" },
  { model: "BYD Sealion 7", battery: "82.6 kWh", range: "~567 km" },
  { model: "BMW iX1", battery: "64.8 kWh", range: "~531 km" },
  { model: "Mercedes‑Benz G‑Class Electric", battery: "116 kWh", range: "≈473 km" },
  { model: "Porsche Taycan", battery: "93.4 kWh", range: "≈705 km" },
  { model: "Volvo XC40 Recharge", battery: "75 kWh", range: "~418 km" }
];

export default function CarModelSelection() {
  const navigate = useNavigate();

  const handleSelect = (model) => {
    localStorage.setItem("selectedCarModel", model);
    alert(`✅ ${model} selected! Returning to Signup Form.`);
    navigate("/"); // Navigates back to SignupLoginForm
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">Select Your EV Model</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {carModels.map((car, index) => (
          <div
            key={index}
            className="bg-white text-gray-900 p-5 rounded-2xl shadow-lg border-2 border-gray-300 hover:border-cyan-500 hover:shadow-xl transition-all cursor-pointer"
            onClick={() => handleSelect(car.model)}
          >
            <h2 className="text-xl font-bold text-indigo-800 mb-2">{car.model}</h2>
            <p className="text-sm font-medium text-gray-700">🔋 Battery: {car.battery}</p>
            <p className="text-sm font-medium text-gray-700">📍 Range: {car.range}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
