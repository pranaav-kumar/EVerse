const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use correct router
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/stations', require('./routes/stationRoutes'));
app.use("/api/bookings", require("./routes/bookings"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Backend running on port 5000")))
  .catch((err) => console.log(err));
