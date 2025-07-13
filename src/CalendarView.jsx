import { useState, useEffect } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import { AnimatePresence, motion } from "framer-motion";
import AppointmentForm from "./AppointmentForm";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

function CalendarView() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [appointmentsByDay, setAppointmentsByDay] = useState(() => {
    const stored = localStorage.getItem("appointments");
    return stored ? JSON.parse(stored) : {};
  });

  const [days, setDays] = useState(() =>
    Array.from({ length: 7 }, (_, i) =>
      dayjs().add(i, "day").format("MMMM D, YYYY")
    )
  );

  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Save to localStorage on every update
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointmentsByDay));
  }, [appointmentsByDay]);

  // ✅ Load from localStorage on page load
  useEffect(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) {
      setAppointmentsByDay(JSON.parse(stored));
    }
  }, []);

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

  const handleSaveAppointment = (appointment) => {
    const key = appointment.date
      ? appointment.date // from desktop modal
      : dayjs(days[currentDayIndex]).format("YYYY-MM-DD"); // from mobile date

    const updatedAppointment = {
      ...appointment,
      date: key, // ensure all saved appointments have `date`
    };

    setAppointmentsByDay((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), updatedAppointment],
    }));

    if (!isMobile) setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-white p-4">
      {isMobile ? (
        <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 text-center space-y-6">
          <input
            type="date"
            value={dayjs(days[currentDayIndex]).format("YYYY-MM-DD")}
            onChange={(e) => {
              const selectedFormatted = dayjs(e.target.value).format("MMMM D, YYYY");
              const foundIndex = days.findIndex((d) => d === selectedFormatted);
              if (foundIndex !== -1) {
                setCurrentDayIndex(foundIndex);
              } else {
                const updatedDays = [...days, selectedFormatted];
                setDays(updatedDays);
                setCurrentDayIndex(updatedDays.length - 1);
              }
            }}
            className="w-full max-w-xs mb-2 p-2 rounded-md bg-white text-black shadow"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentDayIndex}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.y < -50) {
                  if (currentDayIndex === days.length - 1) {
                    const nextDay = dayjs(days[days.length - 1])
                      .add(1, "day")
                      .format("MMMM D, YYYY");
                    setDays((prevDays) => [...prevDays, nextDay]);
                  }
                  setCurrentDayIndex((prev) => prev + 1);
                } else if (info.offset.y > 50 && currentDayIndex > 0) {
                  setCurrentDayIndex((prev) => prev - 1);
                }
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-blue-100 w-full max-w-xs p-6 rounded shadow h-[60vh] flex flex-col justify-center cursor-grab"
            >
              <p
                className={`text-xl font-bold ${
                  days[currentDayIndex] === dayjs().format("MMMM D, YYYY")
                    ? "text-green-700"
                    : "text-slate-800"
                }`}
              >
                {days[currentDayIndex]}
              </p>

              <div className="mt-4 space-y-2 text-left text-sm">
                {(appointmentsByDay[dayjs(days[currentDayIndex]).format("YYYY-MM-DD")] || []).map(
                  (appt, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded p-2 shadow-sm border"
                    >
                      <p className="font-medium">{appt.time}</p>
                      <p className="text-slate-600">Patient: {appt.patient}</p>
                      <p className="text-slate-600">Doctor: {appt.doctor}</p>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <AppointmentForm onSave={handleSaveAppointment} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-slate-500 font-semibold uppercase tracking-wider"
              >
                {day}
              </div>
            ))}

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
                  className={`rounded-xl p-2 border shadow-sm transition-all bg-white/70 hover:bg-blue-100/70 backdrop-blur-sm cursor-pointer
                    ${!isCurrentMonth ? "opacity-40 pointer-events-none" : ""}
                    ${isToday ? "border-blue-500" : "border-slate-200"}`}
                >
                  <div className="text-sm font-semibold text-slate-800 mb-1 text-right">
                    {date.date()}
                  </div>

                  <div className="space-y-1">
                    {(appointmentsByDay[formatted] || []).map((appt, i) => (
                      <div
                        key={i}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        {appt.time} – {appt.patient}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Modal Form */}
          {showModal && selectedDate && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white text-black p-6 rounded-xl w-full max-w-md shadow-lg relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
                >
                  ×
                </button>
                <h2 className="text-lg font-semibold mb-4">
                  Add Appointment for {selectedDate}
                </h2>
                <AppointmentForm
                  onSave={handleSaveAppointment}
                  selectedDate={selectedDate}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CalendarView;
