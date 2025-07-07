const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Save a booking
router.post("/", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: "Booking saved", booking: newBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings for a station on a specific date
router.get("/:stationName/:date", async (req, res) => {
  try {
    const { stationName, date } = req.params;
    const bookings = await Booking.find({ stationName, date });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
