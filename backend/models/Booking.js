const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }, // Format: HH:mm
  guests: { type: Number, required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
});

module.exports = mongoose.model('Booking', bookingSchema);
