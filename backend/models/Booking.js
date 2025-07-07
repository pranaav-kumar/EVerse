const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  stationName: { type: String, required: true },
  slot: { type: String, required: true },
  timestamp: { type: String, required: true },
  date: { type: String, required: true }, // e.g. "2025-07-07"
  userEmail: { type: String, required: true }
});

module.exports = mongoose.model("Booking", bookingSchema);
