import { useState, useEffect } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import { AnimatePresence, motion } from "framer-motion";
import AppointmentForm from "./AppointmentForm";
import toast from "react-hot-toast";

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

  const [editData, setEditData] = useState(null);
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

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointmentsByDay));
  }, [appointmentsByDay]);

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
      ? appointment.date
      : dayjs(days[currentDayIndex]).format("YYYY-MM-DD");

    const updatedAppointments = { ...appointmentsByDay };
    const existing = [...(appointmentsByDay[key] || [])];

    if (appointment.originalIndex !== undefined) {
      existing[appointment.originalIndex] = appointment;
      toast.success("Appointment updated!");
    } else {
      existing.push(appointment);
      toast.success("Appointment added!");
    }

    updatedAppointments[key] = existing;
    setAppointmentsByDay(updatedAppointments);

    if (!isMobile) setShowModal(false);
    setEditData(null);
  };

  const handleDeleteAppointment = (index, date) => {
    const updated = [...(appointmentsByDay[date] || [])];
    updated.splice(index, 1);

    setAppointmentsByDay((prev) => ({
      ...prev,
      [date]: updated,
    }));

    toast.success("Appointment deleted!");
  };

  const handleEditAppointment = (index, date) => {
    const appt = appointmentsByDay[date][index];
    setEditData({ ...appt, originalIndex: index });
    if (!isMobile) {
      setSelectedDate(date);
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e3d6ff] via-[#d4bfff] to-[#cbbaff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6 font-[Jost] text-black dark:text-white">

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
            className="w-full max-w-xs mb-2 p-2 rounded-md bg-white text-black shadow dark:bg-slate-700 dark:text-white"
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
              className="bg-[#5c4d90]/40 text-[#43336b]  backdrop-blur-sm w-full max-w-xs p-6 rounded-2xl shadow-xl shadow-purple-900 shadow-purple-200 h-[60vh] flex flex-col justify-center cursor-grab transition-all duration-300 hover:scale-[1.03]"
            >
              <p
                className={`text-xl font-bold ${
                  days[currentDayIndex] === dayjs().format("MMMM D, YYYY")
                    ? "text-purple-900 dark:text-purple-500"
                    : "text-slate-800 dark:text-white"
                }`}
              >
                {days[currentDayIndex]}
              </p>

              <div className="mt-4 space-y-2 text-left text-sm overflow-y-auto max-h-40 pr-1 scrollbar-hide">
                {(appointmentsByDay[dayjs(days[currentDayIndex]).format("YYYY-MM-DD")] || []).map((appt, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-700 rounded p-2 shadow-sm border flex justify-between items-start gap-2">
                    <div>
                      <p className="font-medium text-black dark:text-white">{appt.time}</p>
                      <p className="text-slate-600 dark:text-slate-300">Patient: {appt.patient}</p>
                      <p className="text-slate-600 dark:text-slate-300">Doctor: {appt.doctor}</p>
                    </div>
                    <div className="space-x-1">
                      <button onClick={() => handleEditAppointment(idx, dayjs(days[currentDayIndex]).format("YYYY-MM-DD"))} className="text-blue-500 dark:text-blue-300">✏️</button>
                      <button onClick={() => handleDeleteAppointment(idx, dayjs(days[currentDayIndex]).format("YYYY-MM-DD"))} className="text-red-500 dark:text-red-300">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <AppointmentForm onSave={handleSaveAppointment} editData={editData} onCancelEdit={() => setEditData(null)} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider"
              >
                {day}
              </div>
            ))}

            {calendarDates.map((date, idx) => {
              const formatted = date.format("YYYY-MM-DD");
              const isCurrentMonth = date.month() === currentMonth.month();
              const isToday = formatted === today;

              return (
                <motion.div
                  key={idx}
                  onClick={() => {
                    setSelectedDate(formatted);
                    setShowModal(true);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                  className={`rounded-xl p-2 border shadow-sm backdrop-blur-sm cursor-pointer transition-all
                    ${!isCurrentMonth ? "opacity-40 pointer-events-none" : ""}
                    ${isToday
                      ? "bg-[#e3d6ff]/80 md-bg-[#aa95ff]/40 dark:bg-[#5c4d91]/50 text-[#5a4e84] dark:text-[#e8ddff] border border-[#5c4d91] dark:border-[#aa95ff] backdrop-blur-sm"

                      : "bg-white/70 hover:bg-blue-100/70 dark:bg-slate-800 hover:dark:bg-slate-700 text-slate-800 dark:text-white border-slate-200 dark:border-slate-600"}
                       h-36 flex flex-col justify-between`}
                >
                  <div className="text-sm font-semibold mb-1 text-right text-black dark:text-white">
                    {date.date()}
                  </div>

                  <div className="space-y-1 overflow-y-auto pr-1 scrollbar-hide text-xs">
                    {(appointmentsByDay[formatted] || []).map((appt, i) => (
                      <div
                        key={i}
                        className="bg-violet-500 text-white px-2 py-1 rounded flex justify-between items-center gap-1"
                      >
                        <span>{appt.time} – {appt.patient}</span>
                        <span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAppointment(i, formatted);
                            }}
                            className="text-xs"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAppointment(i, formatted);
                            }}
                            className="text-xs ml-1"
                          >
                            🗑️
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {showModal && selectedDate && (
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded-xl w-full max-w-md shadow-lg relative"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditData(null);
                    }}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black dark:hover:text-white text-xl font-bold"
                  >
                    ×
                  </button>
                  <h2 className="text-lg font-semibold mb-4">
                    {editData ? "Edit" : "Add"} Appointment for {selectedDate}
                  </h2>
                  <AppointmentForm
                    onSave={handleSaveAppointment}
                    selectedDate={selectedDate}
                    editData={editData}
                    onCancelEdit={() => setEditData(null)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default CalendarView;
