import "leaflet/dist/leaflet.css";
import React from "react";
import { useState } from "react";
import StationMap from "./user/StationMap";
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import AddStations from "./manufacturer/AddStations.jsx";
import Maintenance from './manufacturer/Maintenance.jsx';
import SignupLoginForm from './SignupLoginForm.jsx';
import 'leaflet/dist/leaflet.css';
import Home from "./user/Home";
import StationMaintenance from "./user/StationMaintenance";
import ManufacturerDashboard from './manufacturer/ManufacturerDashboard.jsx';

import Demand from "./manufacturer/Demand.jsx";
import Revenue from './manufacturer/Revenue.jsx'
import Payment from "./user/Payment";
import Payment from "./user/Payment";


function App(){
  const [stations, setStations] = useState([]);
  const updateStation = (updated) => {
    setStations(updated);
  };

  return(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignupLoginForm />} />
          <Route path="/manufacturer-dashboard" element={<ManufacturerDashboard />} />
          <Route path="/addstations" element={<AddStations stations={stations} setStations={setStations} />} />
          <Route path="/maintenance" element={<Maintenance stations={stations} updateStation={updateStation} />} /> 
          <Route path="/user/map" element={<StationMap />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user/station/:id" element={<StationMaintenance />} />
          <Route path="/manufacturer/demand" element={<Demand />} />
          <Route path="/manufacturer/revenue" element={<Revenue />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </BrowserRouter>
  );
}
export default App;