import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";

function CalendarView() {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const days = Array.from({ length: 7 }, (_, i) =>
    dayjs().add(i, "day").format("MMMM D, YYYY")
  );

  const appointmentData = [
    { time: "10:00 AM", patient: "John Doe" },
    { time: "11:30 AM", patient: "Jane Smith" },
    { time: "2:00 PM", patient: "Dr. Strangelove" },
  ];

  const today = dayjs().format("MMMM D, YYYY");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white p-4">
      
      {isMobile ? (
        // 📱 Mobile View with swipe gesture and animated arrow
        <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDayIndex}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.y < -50 && currentDayIndex < days.length - 1) {
                  setCurrentDayIndex(currentDayIndex + 1);
                } else if (info.offset.y > 50 && currentDayIndex > 0) {
                  setCurrentDayIndex(currentDayIndex - 1);
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

          {/* Animated bounce arrow as swipe hint */}
          <div className="mt-6 flex flex-col items-center gap-1">
            {[...Array(3)].map((_, i) => (
                <motion.span
                key={i}
                className="w-2 h-2 bg-slate-400 rounded-full"
                animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                }}
                />
            ))}
          </div>

        </div>
      ) : (
        //  Desktop View – full grid
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
