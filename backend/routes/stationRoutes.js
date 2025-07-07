const express = require('express');
const router = express.Router();
const Station = require('../models/Station');

// POST - Add new station
router.post('/', async (req, res) => {
  try {
    const station = new Station(req.body);
    await station.save();
    res.status(201).json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - All stations
router.get('/', async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete station by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Station.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json({ message: 'Station deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
