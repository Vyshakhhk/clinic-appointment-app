import { useState } from "react";

const patients = ["John Doe", "Jane Smith", "Alice Johnson"];
const doctors = ["Dr. Kumar", "Dr. Patel", "Dr. Meera"];

const AppointmentForm = ({ onSave }) => {
  const [patient, setPatient] = useState(patients[0]);
  const [doctor, setDoctor] = useState(doctors[0]);
  const [time, setTime] = useState("10:00");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patient || !doctor || !time) return;

    onSave({ patient, doctor, time });
    setTime("10:00"); // reset time
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur p-4 rounded-lg shadow-md space-y-4 w-full max-w-xs"
    >
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
