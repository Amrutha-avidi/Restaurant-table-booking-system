import React from 'react'

const DisplaySlots = ({ setSlot, slots ,selectedSlot }) => {
    const availableSlots = slots.availableSlots || []; // Safely access the array
    const formattedSlots = [];

    // Convert to 12-hour format and pair consecutive slots as time ranges
    for (let i = 0; i < availableSlots.length - 1; i++) {
        const startTime = convertTo12HourFormat(availableSlots[i]);
        const endTime = convertTo12HourFormat(availableSlots[i + 1]);
        formattedSlots.push(`${startTime} - ${endTime}`);
    }
    const handleSlotClick = (slot) => {
        // If the clicked slot is already selected, deselect it
        if (slot === selectedSlot) {
          setSlot(null); // Deselect
        } else {
          setSlot(slot); // Select new slot
        }
      };
    
    return (
        <div>
            <h2>Available Time Slots:</h2>
            <ul>
                {formattedSlots.map((slot, index) => (
                    <li key={index}
                        className={`text-md text-center py-1 mb-2 rounded-lg cursor-pointer
                        ${slot === selectedSlot ? 'bg-white text-blue-500 text-xl font-bold'  : 'bg-blue-500 text-white'}`}
                         onClick={()=> handleSlotClick(slot)}
                    >
                        {slot}
                    </li>
                ))}
            </ul>
        </div>
    )
}
// Helper function to convert 24-hour time to 12-hour format with AM/PM
const convertTo12HourFormat = (time24) => {
    const [hours, minutes] = time24.split(':');
    let hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';

    if (hour > 12) {
        hour = hour - 12;
    } else if (hour === 0) {
        hour = 12; // Midnight case
    }

    return `${hour}:${minutes} ${period}`;
};

export default DisplaySlots