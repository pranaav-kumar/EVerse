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
import Demand from "./manufacturer/Demand.jsx";
import Revenue from "./manufacturer/Revenue.jsx";
import Payment from "./user/Payment";
import RoutePlanner from "./user/RoutePlanner.jsx";
import CarModelSelection from "./CarModelSelection.jsx";
import EmergencyRequest from "./user/EmergencyRequest.jsx";
import RequestList from "./user/RequestList.jsx";
import EmergencyPage from "./user/EmergencyPage.jsx";

function App() {
  const [stations, setStations] = useState([]);

  const updateStation = (updated) => setStations(updated);

  return (
    <BrowserRouter>
      <Routes>
        {/* User & Shared Routes */}
        <Route path="/" element={<SignupLoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/car-model-selection" element={<CarModelSelection />} />
        <Route path="/user/map" element={<StationMap />} />
        <Route path="/user/station/:id" element={<StationMaintenance />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/RoutePlanner" element={<RoutePlanner />} />
        <Route path="/user/EmergencyRequest" element={<EmergencyRequest />} />
        <Route path="/user/RequestList" element={<RequestList/>} />
        <Route path="/user/Emergency" element={<EmergencyPage/>} />

        {/* Manufacturer Routes */}
        <Route path="/manufacturer-dashboard" element={<ManufacturerDashboard />} />
        <Route path="/addstations" element={<AddStations stations={stations} setStations={setStations} />} />
        <Route path="/maintenance" element={<Maintenance stations={stations} updateStation={updateStation} />} />
        <Route path="/manufacturer/demand" element={<Demand />} />
        <Route path="/manufacturer/revenue" element={<Revenue />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
