import { useState, useEffect } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import AppointmentForm from "./AppointmentForm";
import Modal from "./Modal"; // Optional: separate modal component

dayjs.extend(weekday);
dayjs.extend(isoWeek);

const CalendarGrid = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [appointments, setAppointments] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const handleSaveAppointment = (appointment) => {
    const key = appointment.date;
    setAppointments((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), appointment],
    }));
    setShowModal(false);
  };

  const generateCalendar = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");

    let date = startDate.clone();
    const calendar = [];

    while (date.isBefore(endDate, "day") || date.isSame(endDate, "day")) {
      calendar.push(date.clone());
      date = date.add(1, "day");
    }

    return calendar;
  };

  const calendarDates = generateCalendar();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Month & Navigation */}
      <div className="flex justify-between items-center mb-4 text-white">
        <button
          onClick={() => setCurrentMonth((prev) => prev.subtract(1, "month"))}
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
        >
          Prev
        </button>
        <h2 className="text-xl font-semibold">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button
          onClick={() => setCurrentMonth((prev) => prev.add(1, "month"))}
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
        >
          Next
        </button>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-300 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDates.map((date, idx) => {
          const formatted = date.format("YYYY-MM-DD");
          const isCurrentMonth = date.month() === currentMonth.month();
          const isToday = formatted === today;

          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedDate(formatted);
                setShowModal(true);
              }}
              className={`rounded-xl p-2 border shadow-sm transition-all backdrop-blur-sm cursor-pointer
                ${!isCurrentMonth ? "opacity-40 pointer-events-none" : ""}
                ${isToday ? "border-blue-500 bg-blue-100/30" : "border-white/20 bg-white/10"}
                hover:bg-blue-200/20`}
            >
              <div className="text-sm font-semibold text-white mb-1 text-right">
                {date.date()}
              </div>

              <div className="space-y-1 text-left text-xs text-white">
                {(appointments[formatted] || []).map((appt, i) => (
                  <div
                    key={i}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    {appt.time} – {appt.patient}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Book Appointment for {selectedDate}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <AppointmentForm
              onSave={handleSaveAppointment}
              selectedDate={selectedDate}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;
