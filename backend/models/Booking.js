const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }, // Format: HH:mm
  guests: { type: Number, required: true, min: 1 }, // Ensure at least 1 guest
  name: {
    type: String,
    required: true,
    match: [/^[a-zA-Z\s]+$/, 'Name should only contain alphabets and spaces.'], // Validate name with regex
  },
  contact: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Contact number must be a 10-digit number.'], // Validate contact with regex (10 digits)
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
