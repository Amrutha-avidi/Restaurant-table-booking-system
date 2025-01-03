export default function hourFormatConverter(time24) {
    let [hours, minutes] = time24.split(':');
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    // Convert 24-hour format to 12-hour format
    let period = 'AM';
    if (hours >= 12) {
        period = 'PM';
        if (hours > 12) {
            hours -= 12; // Convert 13-23 hours to 1-11 PM
        }
    } else if (hours === 0) {
        hours = 12; // Midnight case
    }

    const startTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;

    // Add 30 minutes to the start time
    minutes += 30;
    if (minutes >= 60) {
        minutes -= 60;
        hours += 1; // Carry over the hour if minutes exceed 60
    }

    // Adjust hour if necessary (for example, 12:30 PM becomes 1:00 PM)
    if (hours === 12 && minutes === 0) {
        hours = 12;
    } else if (hours > 12) {
        hours -= 12; // Convert back to 12-hour format after 12 PM
    }

    const endTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;

    return `${startTime} - ${endTime}`; 
}
