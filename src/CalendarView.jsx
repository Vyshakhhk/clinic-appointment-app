import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import AppointmentForm from "./AppointmentForm";

function CalendarView() {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [appointmentsByDay, setAppointmentsByDay] = useState({});

  const days = Array.from({ length: 7 }, (_, i) =>
    dayjs().add(i, "day").format("MMMM D, YYYY")
  );

  const today = dayjs().format("MMMM D, YYYY");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSaveAppointment = (appointment) => {
    const day = days[currentDayIndex];
    setAppointmentsByDay((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), appointment],
    }));
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-6">
        Appointments Calendar 📅
      </h1>

      {isMobile ? (
        <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 text-center space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDayIndex}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.y < -50 && currentDayIndex < days.length - 1) {
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
                  days[currentDayIndex] === today
                    ? "text-green-700"
                    : "text-slate-800"
                }`}
              >
                {days[currentDayIndex]}
              </p>

              <div className="mt-4 space-y-2 text-left text-sm">
                {(appointmentsByDay[days[currentDayIndex]] || []).map(
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
        <div className="grid grid-cols-4 gap-4">
          {days.map((day, i) => (
            <div
              key={i}
              className="bg-blue-100 p-4 rounded shadow text-left space-y-2"
            >
              <p
                className={`font-semibold text-center ${
                  day === today ? "text-green-700 underline" : "text-slate-800"
                }`}
              >
                {day}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                {(appointmentsByDay[day] || []).map((appt, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded p-2 shadow-sm border"
                  >
                    <p className="font-medium">{appt.time}</p>
                    <p className="text-slate-600">Patient: {appt.patient}</p>
                    <p className="text-slate-600">Doctor: {appt.doctor}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CalendarView;
