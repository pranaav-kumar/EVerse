import "leaflet/dist/leaflet.css";
import { useState } from "react";
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import AddStations from "./AddStations.jsx";
import Home from './Home.jsx';
import Maintenance from './Maintenance.jsx';

function App(){
  const [stations, setStations] = useState([]);
  const updateStation = (updated) => {
    setStations(updated);
  };

  return(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addstations" element={<AddStations stations={stations} setStations={setStations} />} />
          <Route path="/maintenance" element={<Maintenance stations={stations} updateStation={updateStation} />} />        </Routes>
      </BrowserRouter>
  );
}
export default App;