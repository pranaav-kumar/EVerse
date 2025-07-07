const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'manufacturer'], required: true },

  // Customer-specific fields
  carModel: String,
  chargerModel: String,

  // Manufacturer-specific fields
  companyName: String,
  businessEmail: String,
  licenseNumber: String,
  manufacturerType: String,
});

module.exports = mongoose.model('User', userSchema);
