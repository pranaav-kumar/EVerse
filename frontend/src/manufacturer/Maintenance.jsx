import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import

const MAINTENANCE_INTERVAL = 365; // days

function Maintenance({ stations, updateStation }) {
  const [updatedStations, setUpdatedStations] = useState([]);
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    const now = new Date();
    const calculated = stations.map((station) => {
      const lastService = station.lastServicedDate ? new Date(station.lastServicedDate) : null;
      const daysSince = lastService ? Math.floor((now - lastService) / (1000 * 60 * 60 * 24)) : MAINTENANCE_INTERVAL;
      const daysLeft = Math.max(MAINTENANCE_INTERVAL - daysSince, 0);
      const healthPercent = Math.max((daysLeft / MAINTENANCE_INTERVAL) * 100, 0);

      return {
        ...station,
        daysLeft,
        healthPercent,
      };
    });

    setUpdatedStations(calculated);
  }, [stations]);

  const handleServiceUpdate = (index, newDate) => {
    const newStations = [...stations];
    newStations[index].lastServicedDate = newDate;
    updateStation(newStations);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center text-blue-600 flex-1">EV Station Maintenance</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold px-4 py-2 rounded transition-colors"
          >
            ← Back
          </button>
        </div>
        {updatedStations.length === 0 ? (
          <p className="text-center text-gray-500">No stations found.</p>
        ) : (
          <div className="space-y-6">
            {updatedStations.map((station, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-blue-700">{station.name}</h2>
                  <p className="text-sm text-gray-500">Location: {station.location?.address || `Lat ${station.location?.lat?.toFixed(2)}, Lng ${station.location?.lng?.toFixed(2)}`}</p>
                </div>

                <div className="my-2">
                  <label className="text-sm font-medium text-black">Last Serviced Date:</label>
                  <input
                    type="date"
                    value={station.lastServicedDate ? station.lastServicedDate.substring(0, 10) : ''}
                    onChange={(e) => handleServiceUpdate(index, e.target.value)}
                    className="ml-2 border px-2 py-1 rounded"
                  />
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${station.healthPercent < 10 ? 'bg-red-600' : 'bg-green-500'}`}
                    style={{ width: `${station.healthPercent}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1 text-black">{station.daysLeft} days left until next maintenance</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Maintenance;
