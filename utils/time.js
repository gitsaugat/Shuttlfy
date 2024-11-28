export function getTimeSlots(startTime, endTime) {
  const today = new Date(); // Get current date (local time)
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  // Reset today's date object to avoid changing the date when setting the time
  const start = new Date(today.setHours(startHours, startMinutes, 0, 0));
  const end = new Date(today.setHours(endHours, endMinutes, 0, 0));

  const slots = [];

  // Function to format the time in 12-hour AM/PM format
  const formatAMPM = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesFormatted} ${ampm}`;
  };

  // Get the current time (with seconds set to 0 for precision)
  const currentTime = new Date();

  // Loop through from start to end time with 30-minute intervals
  for (
    let time = new Date(start);
    time <= end;
    time.setMinutes(time.getMinutes() + 30)
  ) {
    // Only add the time slot if it's greater than the current time
    if (time > currentTime) {
      slots.push(formatAMPM(time)); // Add formatted time with AM/PM
    }
  }
  console.log(slots);
  return slots;
}
