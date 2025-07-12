import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";

function CalendarView() {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const appointmentData = [
    { time: "10:00 AM", patient: "John Doe" },
    { time: "11:30 AM", patient: "Jane Smith" },
    { time: "2:00 PM", patient: "Dr. Strangelove" },
  ];

  const today = dayjs().format("MMMM D, YYYY");

  useEffect(() => {
    // Generate 30 days from today
    const nextDays = Array.from({ length: 30 }, (_, i) =>
      dayjs().add(i, "day")
    );
    setDays(nextDays);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDateChange = (e) => {
    const selected = dayjs(e.target.value);
    const index = days.findIndex((d) => d.isSame(selected, "day"));
    if (index !== -1) {
      setCurrentDayIndex(index);
      setSelectedDate(e.target.value);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-6">
        Appointments Calendar 📅
      </h1>

      {isMobile ? (
        <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 text-center space-y-4">
          {/* 📅 Date Picker */}
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="mb-4 px-4 py-2 rounded border text-sm shadow-sm w-full max-w-xs"
          />

          {/* 🗓️ Mobile Day View with Swipe */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDayIndex}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.y < -50 && currentDayIndex < days.length - 1) {
                  setCurrentDayIndex(currentDayIndex + 1);
                  setSelectedDate(days[currentDayIndex + 1].format("YYYY-MM-DD"));
                } else if (info.offset.y > 50 && currentDayIndex > 0) {
                  setCurrentDayIndex(currentDayIndex - 1);
                  setSelectedDate(days[currentDayIndex - 1].format("YYYY-MM-DD"));
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
                  days[currentDayIndex].format("MMMM D, YYYY") === today
                    ? "text-green-700"
                    : "text-slate-800"
                }`}
              >
                {days[currentDayIndex].format("MMMM D, YYYY")}
              </p>

              <div className="mt-4 space-y-2 text-left text-sm">
                {appointmentData.map((appt, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded p-2 shadow-sm border"
                  >
                    <p className="font-medium">{appt.time}</p>
                    <p className="text-slate-600">Patient: {appt.patient}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="text-xs text-slate-500 mt-1">📆 Swipe or pick a date</p>
        </div>
      ) : (
        // 💻 Desktop Grid View
        <div className="grid grid-cols-4 gap-4">
          {days.slice(0, 7).map((day, i) => (
            <div
              key={i}
              className="bg-blue-100 p-4 rounded shadow text-left space-y-2"
            >
              <p
                className={`font-semibold text-center ${
                  day.format("MMMM D, YYYY") === today
                    ? "text-green-700 underline"
                    : "text-slate-800"
                }`}
              >
                {day.format("MMMM D, YYYY")}
              </p>
              <div className="mt-4 space-y-2 text-sm">
                {appointmentData.map((appt, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded p-2 shadow-sm border"
                  >
                    <p className="font-medium">{appt.time}</p>
                    <p className="text-slate-600">Patient: {appt.patient}</p>
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
