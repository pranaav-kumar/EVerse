import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

async function reverseGeocode(lat, lng) {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
  const data = await res.json();
  return data.display_name || 'Unknown Location';
}

async function geocodeAddress(address) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  const data = await res.json();
  if (data.length === 0) return null;
  const place = data[0];
  return {
    lat: parseFloat(place.lat),
    lng: parseFloat(place.lon),
    address: place.display_name,
  };
}

function MapSearch({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 14);
  }, [position, map]);
  return null;
}

function MapClick({ setFormData }) {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const address = await reverseGeocode(lat, lng);
      setFormData(prev => ({ ...prev, location: { lat, lng, address } }));
    }
  });
  return null;
}

function AddStations() {
  const [formData, setFormData] = useState({
    name: '',
    location: null,
    type: [],
    connectors: '',
    ports: '',
    power: '',
  });

  const [stations, setStations] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [view, setView] = useState('add');
  const [editingIndex, setEditingIndex] = useState(null);
  const navigate = useNavigate();

  // Fetch all stations from backend
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/stations");
        const data = await response.json();
        setStations(data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };
    fetchStations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const updatedType = checked
        ? [...prev.type, value]
        : prev.type.filter(t => t !== value);
      return { ...prev, type: updatedType };
    });
  };

  const handleAddStation = async () => {
    const { name, location, type, connectors, ports, power } = formData;
    if (!name || !location || type.length === 0 || !connectors || !ports || !power) {
      alert('Please fill all fields and select location on the map.');
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/stations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save station");

      const savedStation = await response.json();
      setStations(prev => [...prev, savedStation]);

      alert("✅ Station added successfully!");
      setFormData({ name: '', location: null, type: [], connectors: '', ports: '', power: '' });
      setEditingIndex(null);
    } catch (err) {
      console.error("Error adding station:", err);
      alert("❌ Failed to add station.");
    }
  };

  const handleEdit = (index) => {
    setFormData(stations[index]);
    setView('add');
    setEditingIndex(index);
  };

  const handleRemove = async (index) => {
  const station = stations[index];

  if (!station._id) {
    alert("❌ Station ID missing. Cannot delete.");
    return;
  }

  if (window.confirm("Delete this station?")) {
    try {
      const res = await fetch(`http://localhost:5000/api/stations/${station._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete station");
      }

      setStations(prev => prev.filter((_, i) => i !== index));
      alert("✅ Station deleted!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete station");
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 text-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex-1 text-center">EV Station Management</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold px-4 py-2 rounded transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="flex gap-2 justify-center mb-4">
          <button
            onClick={() => {
              setView('add');
              setEditingIndex(null);
              setFormData({ name: '', location: null, type: [], connectors: '', ports: '', power: '' });
            }}
            className={`px-4 py-2 rounded ${view === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {editingIndex !== null ? 'Edit Station' : 'Add Station'}
          </button>
          <button
            onClick={() => setView('manage')}
            className={`px-4 py-2 rounded ${view === 'manage' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Manage Stations
          </button>
        </div>

        {view === 'add' && (
          <div className="space-y-4">
            <input
              name="name"
              placeholder="Station Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white text-gray-900"
            />

            <div>
              <label className="block mb-1">Search or Select Location:</label>
              <div className="mb-2 flex gap-2">
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search location..."
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={async () => {
                    const result = await geocodeAddress(searchInput);
                    if (result) {
                      setFormData(prev => ({ ...prev, location: result }));
                    } else {
                      alert("Location not found.");
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Search
                </button>
              </div>

              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '250px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClick setFormData={setFormData} />
                <MapSearch position={formData.location && [formData.location.lat, formData.location.lng]} />
                {formData.location && <Marker position={[formData.location.lat, formData.location.lng]} />}
              </MapContainer>

              {formData.location && (
                <p className="mt-2 text-sm">
                  📍 {formData.location.address}<br />
                  Lat: {formData.location.lat.toFixed(4)}, Lng: {formData.location.lng.toFixed(4)}
                </p>
              )}
            </div>

            <div className="flex gap-4 items-center">
              <label><input type="checkbox" value="Charging" checked={formData.type.includes("Charging")} onChange={handleTypeChange} /> Charging</label>
              <label><input type="checkbox" value="Swapping" checked={formData.type.includes("Swapping")} onChange={handleTypeChange} /> Swapping</label>
            </div>

            <select name="connectors" value={formData.connectors} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Connector Type</option>
              <option>Type2</option>
              <option>CCS</option>
              <option>CHAdeMO</option>
              <option>Bharat AC</option>
              <option>Bharat DC</option>
            </select>

            <input type="number" name="ports" placeholder="Number of Ports" value={formData.ports} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="text" name="power" placeholder="Power Rating (kW)" value={formData.power} onChange={handleChange} className="w-full p-2 border rounded" />

            <button onClick={handleAddStation} className="w-full bg-green-600 text-white p-2 rounded">
              {editingIndex !== null ? 'Update Station' : 'Add Station'}
            </button>
          </div>
        )}

        {view === 'manage' && (
          <div className="space-y-4">
            {stations.length === 0 ? (
              <p className="text-center">No stations available.</p>
            ) : (
              stations.map((st, i) => (
                <div key={i} className="border p-3 rounded">
                  <h2 className="font-bold">{st.name}</h2>
                  <p>{st.location?.address}</p>
                  <p>Lat: {st.location?.lat?.toFixed(4)} | Lng: {st.location?.lng?.toFixed(4)}</p>
                  <p>Type: {st.type?.join(', ')}</p>
                  <p>Connectors: {st.connectors}, Ports: {st.ports}, Power: {st.power}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEdit(i)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleRemove(i)} className="bg-red-600 px-2 py-1 text-white rounded">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddStations;
