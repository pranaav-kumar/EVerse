const mongoose = require('mongoose');
const StationSchema = new mongoose.Schema({
  name: String,
  location: { lat: Number, lng: Number },
  ports: Number,
  availablePorts: Number,
  type: String, // charging or swap
  batteryAvailable: Number,
  healthStatus: { type: String, default: "active" }
});
module.exports = mongoose.model('Station', StationSchema);
