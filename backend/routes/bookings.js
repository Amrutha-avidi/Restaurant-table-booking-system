const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

const availableSlots = [
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00"
];
// Create Booking
router.post('/', async (req, res) => {
    const { date, time, guests, name, contact } = req.body;

    if (!date || !time || !guests || !name || !contact) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check for double booking
        const existingBooking = await Booking.findOne({ date, time });
        if (existingBooking) {
            return res.status(409).json({ error: 'This slot is already booked' });
        }

        const newBooking = new Booking({ date, time, guests, name, contact });
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

router.get('/',(req,res)=>{
    res.json("its working")
})

// Get Available Slots for a specific date
router.get('/bookings', async (req, res) => {
    const { date } = req.query;  // Expecting date as a query param
    try {
        const startDate = new Date(date)
        const endDate = new Date(date);
        endDate.setDate(startDate.getDate() + 1);

        // Find all bookings for the selected date
        const bookings = await Booking.find({
            date: {
                $gte: startDate,
                $lt: endDate,
            },

        });
        // Extract booked times for that date

        const bookedTimes = bookings.map(booking => booking.time);
        // Filter out booked times from available slots
        const available = availableSlots.filter(slot => !bookedTimes.includes(slot));


        if (available.length === 0) {
            return res.status(200).json({ message: "No available slots for the selected date" });
        }

        // Return available slots
        res.json({ availableSlots: available });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Delete Booking
router.delete('/bookings', async (req, res) => {
    const { date, slot } = req.query;
   
    if (!date || !slot) {
        return res.status(400).json({ message: 'Date and slot are required' });
    }

    try {
        const result = await Booking.deleteOne({ date, time: slot });
        console.log(result)
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No booking found for the given date and slot' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
