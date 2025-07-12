import { useState } from "react";

function AppointmentForm({ onSave }) {
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patient || !doctor || !time) {
      alert("Please fill all fields");
      return;
    }

    onSave({ patient, doctor, time });

    // Clear form after save
    setPatient("");
    setDoctor("");
    setTime("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-md space-y-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-slate-800 text-center">Add Appointment</h2>

      <div className="flex flex-col">
        <label className="text-sm text-slate-700 mb-1">Patient</label>
        <select
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Select patient</option>
          <option value="John Doe">John Doe</option>
          <option value="Jane Smith">Jane Smith</option>
          <option value="Alice Cooper">Alice Cooper</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-slate-700 mb-1">Doctor</label>
        <select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Select doctor</option>
          <option value="Dr. House">Dr. House</option>
          <option value="Dr. Watson">Dr. Watson</option>
          <option value="Dr. Strange">Dr. Strange</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-slate-700 mb-1">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
      >
        Save Appointment
      </button>
    </form>
  );
}

export default AppointmentForm;
