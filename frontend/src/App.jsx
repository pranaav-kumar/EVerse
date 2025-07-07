import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import StationMap from "./user/StationMap";
import AddStations from "./manufacturer/AddStations.jsx";
import Maintenance from "./manufacturer/Maintenance.jsx";
import SignupLoginForm from "./SignupLoginForm.jsx";
import Home from "./user/Home";
import StationMaintenance from "./user/StationMaintenance";
import ManufacturerDashboard from "./manufacturer/ManufacturerDashboard.jsx";
import Payment from "./user/Payment";
import CarModelSelection from "./CarModelSelection.jsx"; // ✅ Add this import

function App() {
  const [stations, setStations] = useState([]);
  const updateStation = (updated) => setStations(updated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupLoginForm />} />
        <Route path="/car-model-selection" element={<CarModelSelection />} /> {/* ✅ Add this route */}
        <Route path="/manufacturer-dashboard" element={<ManufacturerDashboard />} />
        <Route path="/addstations" element={<AddStations stations={stations} setStations={setStations} />} />
        <Route path="/maintenance" element={<Maintenance stations={stations} updateStation={updateStation} />} />
        <Route path="/user/map" element={<StationMap />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user/station/:id" element={<StationMaintenance />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
