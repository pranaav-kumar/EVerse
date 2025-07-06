const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stations', require('./routes/stationRoutes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Backend running on port 5000")))
  .catch((err) => console.log(err));
