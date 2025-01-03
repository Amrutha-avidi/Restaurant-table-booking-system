'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import hourFormatConverter from '../hourFormatConverter'

export default function SuccessBooking() {
  const [bookingData, setBookingData] = useState(null);

  // Load booking data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('bookingData');
    if (storedData) {
      setBookingData(JSON.parse(storedData));
    }
  }, []);


  let formattedTime
  if (bookingData) {
    formattedTime = hourFormatConverter(bookingData.time)
    console.log(formattedTime)
  }

  // Handle delete booking
  const handleDeleteBooking = async () => {
    if (!bookingData) return;

    try {
      const { date, time } = bookingData;
      const url = `${config.backendBaseURL}/bookings`;
      const response = await axios.delete(url, {
        params: { date, slot: time }
      });
      if (response.status === 200) {
        localStorage.removeItem('bookingData');
        setBookingData(null);
        alert('Booking data deleted!');
      }

    }
    catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    }

  };

  return bookingData ? (
    <div className="min-h-screen flex flex-col items-center justify-center  bg-gradient-to-br from-green-100 to-blue-50">
      <div className="bg-white shadow-lg rounded-lg px-8 py-5 w-full max-w-md text-center">
        <div className="mb-4">
          <img
            src="https://res.cloudinary.com/drpddho9b/image/upload/v1735888558/succces_ufbkt1.png" // Replace with your tick icon image path
            alt="Success"
            className="w-24 h-24 mx-auto my-0"
          />
        </div>
        <h1 className="text-2xl font-bold text-green-600">Booking Successful!</h1>
        <div className="mt-6">
          <p className="text-lg font-medium">Booking Details</p>
          <div className="mt-4 text-left">
            <p><span className="font-bold">Name:</span> {bookingData.name}</p>
            <p><span className="font-bold">Contact:</span> {bookingData.contact}</p>
            <p><span className="font-bold">Date of Booking:</span> {bookingData.date}</p>
            <p><span className="font-bold">Your Slot:</span> {formattedTime}</p>
            <p><span className="font-bold">No. of Guests:</span> {bookingData.guests}</p>
          </div>
        </div>
        <button
          onClick={handleDeleteBooking}
          className="mt-6 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Cancel Booking
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <h2 className="text-2xl font-bold text-red-500">No booking data found</h2>
    </div>
  );
}
