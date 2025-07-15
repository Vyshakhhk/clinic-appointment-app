import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import AppointmentForm from "./AppointmentForm";
import Modal from "./Modal";

const CalendarGrid = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState({});
  const [showModal, setShowModal] = useState(false);

  const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

  useEffect(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) setAppointments(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleSaveAppointment = (appointment) => {
    const key = formatDate(appointment.date);
    setAppointments((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), appointment],
    }));
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Always white text regardless of dark mode */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Clinic Appointment Calendar
      </h2>

      <div className="calendar-wrapper">
        <Calendar
          onChange={handleDateClick}
          value={selectedDate}
          tileClassName={({ date, view }) => {
            if (view !== "month") return "";

            const isToday = formatDate(date) === formatDate(new Date());
            const isSelected =
              formatDate(date) === formatDate(selectedDate);

            let classes = `
              text-sm p-2 rounded-lg text-center transition-colors duration-200
              bg-white text-gray-900 hover:bg-gray-100 border border-gray-300
            `;

            if (isToday) {
              classes += " border-purple-400 font-semibold";
            }
            if (isSelected) {
              classes += " border-2 border-purple-500 font-semibold";
            }

            return classes;
          }}
          tileContent={({ date }) => {
            const key = formatDate(date);
            const dayAppointments = appointments[key] || [];
            return (
              <div className="mt-1 space-y-0.5 text-[10px] text-gray-900">
                {dayAppointments.map((appt, i) => (
                  <div
                    key={i}
                    className="bg-[#9333ea] text-white rounded px-1 py-0.5 truncate"
                  >
                    {appt.time} – {appt.patient}
                  </div>
                ))}
              </div>
            );
          }}
          className="rounded-lg shadow-xl p-2 bg-white/10 backdrop-blur-md text-sm"
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Book Appointment for {formatDate(selectedDate)}
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
