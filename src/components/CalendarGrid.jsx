import React from 'react';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// This will be replaced with dynamic logic later
const calendarDates = [
  29, 30, 1, 2, 3, 4, 5,
  6, 7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, 1, 2
];

const CalendarGrid = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Weekday Header Row */}
      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-300 mb-2">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDates.map((date, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 text-center hover:bg-opacity-20 transition-all duration-300 cursor-pointer"
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
