import { useState, useEffect } from "react";

const patients = ["John Doe", "Jane Smith", "Alice Johnson", "Peter Parker"];
const doctors = ["Dr. Kumar", "Dr. Strange", "Dr. Meera", "Dr. Wells"];

const AppointmentForm = ({ onSave, selectedDate, editData, onCancelEdit }) => {
  const [patient, setPatient] = useState(patients[0]);
  const [doctor, setDoctor] = useState(doctors[0]);
  const [time, setTime] = useState("10:00");

  useEffect(() => {
    if (editData) {
      setPatient(editData.patient);
      setDoctor(editData.doctor);
      setTime(editData.time);
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patient || !doctor || !time) return;

    const appointment = {
      patient,
      doctor,
      time,
      ...(selectedDate && { date: selectedDate }),
      ...(editData?.originalIndex !== undefined && { originalIndex: editData.originalIndex }),
    };

    onSave(appointment);
    setTime("10:00");
    if (onCancelEdit) onCancelEdit(); // close edit mode
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur p-4 rounded-lg shadow-md space-y-4 w-full max-w-xs"
    >
      {selectedDate && (
        <div className="text-left text-sm">
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="text"
            value={selectedDate}
            readOnly
            className="w-full p-2 rounded bg-white text-black font-semibold"
          />
        </div>
      )}

      <div className="text-left text-sm">
        <label className="block mb-1 font-medium">Patient</label>
        <select
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-white text-black brder border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-[#9333ea] transition"
        >
          {patients.map((p, idx) => (
            <option key={idx} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="text-left text-sm">
        <label className="block mb-1 font-medium">Doctor</label>
        <select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-[#9333ea] transition"
        >
          {doctors.map((d, idx) => (
            <option key={idx} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="text-left text-sm">
        <label className="block mb-1 font-medium">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-[#9333ea] transition"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-[#9333ea] hover:bg-[#7e22ce] text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
        >
          {editData ? "Update" : "Save"} Appointment
        </button>
        {editData && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AppointmentForm;
