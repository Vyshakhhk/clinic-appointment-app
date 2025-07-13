import { useState } from "react";

const patients = ["John Doe", "Jane Smith", "Alice Johnson", "Peter Parker"];
const doctors = ["Dr. Kumar", "Dr. Strange", "Dr. Meera", "Dr. Wells"];

const AppointmentForm = ({ onSave, selectedDate }) => {
  const [patient, setPatient] = useState(patients[0]);
  const [doctor, setDoctor] = useState(doctors[0]);
  const [time, setTime] = useState("10:00");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patient || !doctor || !time) return;

    const appointment = {
      patient,
      doctor,
      time,
      ...(selectedDate && { date: selectedDate }) // Add date only if passed
    };

    onSave(appointment);
    setTime("10:00");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur p-4 rounded-lg shadow-md space-y-4 w-full max-w-xs"
    >
      {/* Conditionally show date (only on desktop) */}
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
          className="w-full p-2 rounded bg-white text-black"
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
          className="w-full p-2 rounded bg-white text-black"
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
          className="w-full p-2 rounded bg-white text-black"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
      >
        Save Appointment
      </button>
    </form>
  );
};

export default AppointmentForm;
