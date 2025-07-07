const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: String,
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  type: [String], // ['Charging', 'Swapping']
  connectors: String,
  ports: Number,
  power: String,
});

module.exports = mongoose.model('Station', stationSchema);
