const express = require('express');
const router = express.Router();
const Station = require('../models/Station');

router.get('/', async (req, res) => {
  const stations = await Station.find();
  res.json(stations);
});

router.post('/', async (req, res) => {
  const newStation = new Station(req.body);
  await newStation.save();
  res.json(newStation);
});

module.exports = router;
