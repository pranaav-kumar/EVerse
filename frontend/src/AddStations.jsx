import React, { useState } from 'react';

function AddStations() {
  const [stations, setStations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: [],
    connectors: '',
    ports: '',
    power: '',
  });
  const [view, setView] = useState('add');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const types = checked
        ? [...prev.type, value]
        : prev.type.filter((t) => t !== value);
      return { ...prev, type: types };
    });
  };

  const handleAddStation = () => {
    const { name, location, type, connectors, ports, power } = formData;
    if (!name || !location || type.length === 0 || !connectors || !ports || !power) {
      alert(' Please fill all fields');
      return;
    }

    if (editingIndex !== null) {
      const updated = [...stations];
      updated[editingIndex] = formData;
      setStations(updated);
      setEditingIndex(null);
      alert(' Station updated!');
    } else {
      setStations((prev) => [...prev, formData]);
      alert(' Station added!');
    }

    setFormData({ name: '', location: '', type: [], connectors: '', ports: '', power: '' });
  };

  const handleRemove = (index) => {
    const confirmed = window.confirm('Are you sure you want to delete this station?');
    if (confirmed) {
      setStations((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (index) => {
    setFormData(stations[index]);
    setView('add');
    setEditingIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">EV Station Management</h1>

        {/* View toggle buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => {
              setView('add');
              setFormData({ name: '', location: '', type: [], connectors: '', ports: '', power: '' });
              setEditingIndex(null);
            }}
            className={`px-6 py-2 rounded-lg font-medium ${
              view === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
             {editingIndex !== null ? 'Edit Station' : 'Add Station'}
          </button>
          <button
            onClick={() => {
              setView('manage');
              setFormData({ name: '', location: '', type: [], connectors: '', ports: '', power: '' });
              setEditingIndex(null);
            }}
            className={`px-6 py-2 rounded-lg font-medium ${
              view === 'manage' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
             Manage Stations
          </button>
        </div>

        {/* Add Station Form */}
        {view === 'add' && (
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Station Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="Charging"
                  checked={formData.type.includes('Charging')}
                  onChange={handleTypeChange}
                  className="accent-blue-500"
                />
                Charging
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="Swapping"
                  checked={formData.type.includes('Swapping')}
                  onChange={handleTypeChange}
                  className="accent-blue-500"
                />
                Swapping
              </label>
            </div>

            <select
              name="connectors"
              value={formData.connectors}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Connector Type</option>
              <option value="Type2">Type2</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="Bharat AC">Bharat AC</option>
              <option value="Bharat DC">Bharat DC</option>
            </select>

            <input
              type="number"
              name="ports"
              placeholder="Number of Ports"
              value={formData.ports}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="power"
              placeholder="Power Rating (kW)"
              value={formData.power}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <button
              onClick={handleAddStation}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              {editingIndex !== null ? ' Update Station' : ' Add Station'}
            </button>
          </div>
        )}

        {/* Manage Stations */}
        {view === 'manage' && (
          <div className="mt-6">

            {stations.length === 0 ? (
              <p className="text-center text-gray-500">No stations added yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 mt-4">
                {stations.map((station, index) => (
                  <div key={index} className="bg-white border rounded-xl shadow p-5 space-y-2">
                    <h2 className="text-xl font-semibold text-blue-600">{station.name}</h2>
                    <p><strong> Location:</strong> {station.location}</p>
                    <p><strong> Type:</strong> {station.type.join(', ')}</p>
                    <p><strong> Connectors:</strong> {station.connectors}</p>
                    <p><strong> Ports:</strong> {station.ports}</p>
                    <p><strong> Power:</strong> {station.power} kW</p>
                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                         Edit
                      </button>
                      <button
                        onClick={() => handleRemove(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddStations;
