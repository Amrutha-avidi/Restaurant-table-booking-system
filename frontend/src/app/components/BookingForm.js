"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import config from '../config';
import DisplaySlots from '../DisplaySlots';

const BookingForm = () => {
    const [name, setName] = useState("")
    const [contact, setContact] = useState("")
    const [date, setDate] = useState("")
    const [selectedSlot, setSelectedSlot] = useState("")
    const [remainingSlots, setRemainingSlots] = useState([])
    const [guests, setGuests] = useState(1)
    const [errorMessage, setErrorMessage] = useState("")

    const router = useRouter()

    useEffect(() => {
        if (date) {
            const getAvailableSlots = async () => {
                try {
                    const url = `${config.backendBaseURL}/bookings/?date=${date}`;
                    const response = await axios.get(url);
                    setRemainingSlots(response.data); // Assuming the data returned is the array of available slots
                } catch (error) {
                    console.error("Error fetching available slots:", error);
                    setErrorMessage("Error fetching available slots.");
                }
            };

            getAvailableSlots();
        }
    }, [date]);

    // Handle date change
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        let bookingData = {};

        if (!selectedSlot) {
            setErrorMessage("Please select a time slot.");
            return;
        }

        // Validate name (only alphabets and spaces)
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            setErrorMessage("Name should only contain alphabets and spaces.");
            return;
        }

        // Validate contact (must be 10 digits)
        if (!/^\d{10}$/.test(contact)) {
            setErrorMessage("Contact number must be a 10-digit number.");
            return;
        }

        // Validate guests (positive number)
        if (guests <= 0) {
            setErrorMessage("Guests must be a positive number.");
            return;
        }

        bookingData = {
            date,
            time: selectedSlot,
            guests,
            name,
            contact
        };

        // Send POST request to backend to create booking
        try {
            const url = `${config.backendBaseURL}/`;
            const response = await axios.post(url, bookingData);
            const selectedBooking = response.data;
            if (selectedBooking.error) {
                setErrorMessage(selectedBooking.error); // Handle booking error
            } else {
                setErrorMessage("");
                localStorage.setItem('bookingData', JSON.stringify(bookingData));

                router.push('/successbooking');


                // Reset form after successful submission
                setContact("");
                setDate("");
                setName("");
                setGuests(1);
                setSelectedSlot(""); // Clear selected slot
                setRemainingSlots([]); // Clear available slots
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            setErrorMessage("Error while booking the table.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 gap-10">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Booking Form
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Name :</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder='Enter your name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={date}
                            onChange={handleDateChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="guests">Guests</label>
                        <input
                            type="number"
                            id="guests"
                            name="guests"
                            min="1"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact">Contact Number</label>
                        <input
                            type="tel"
                            id="contact"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your contact number"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Confirm Booking
                        </button>
                        {errorMessage && <p className='text-red-500 mt-2'>{errorMessage}</p>}
                    </div>
                </form>
            </div>

            <div>
                <h1>Select the preferred date of your booking</h1>
                {remainingSlots.length !== 0 ? <DisplaySlots selectedSlot={selectedSlot} setSlot={setSelectedSlot} slots={remainingSlots} />
                    : <p>Please select the preferred date to get the slots.</p>}
            </div>
        </div>
    );
};

export default BookingForm;
