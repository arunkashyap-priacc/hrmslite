import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    status: "Present",
  });

  const fetchEmployees = async () => {
    const res = await API.get("/employees/");
    setEmployees(res.data);
  };

  const fetchAttendance = async () => {
    const res = await API.get("/attendance/");
    setRecords(res.data);
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/attendance/", form);
    setForm({
      employee_id: "",
      date: "",
      status: "Present",
    });
    fetchAttendance();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-6">
        Attendance Management
      </h2>

      {/* Mark Attendance */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
        <h3 className="text-xl font-semibold mb-4">
          Mark Attendance
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4"
        >
          <select
            className="border p-3 rounded-lg"
            value={form.employee_id}
            onChange={(e) =>
              setForm({ ...form, employee_id: e.target.value })
            }
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp.employee_id}>
                {emp.full_name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="border p-3 rounded-lg"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            required
          />

          <select
            className="border p-3 rounded-lg"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option>Present</option>
            <option>Absent</option>
          </select>

          <button
            type="submit"
            className="md:col-span-3 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Mark Attendance
          </button>
        </form>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left">Employee ID</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, index) => (
              <tr
                key={rec._id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="p-4">{rec.employee_id}</td>
                <td className="p-4">{rec.date}</td>
                <td
                  className={`p-4 font-semibold ${
                    rec.status === "Present"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {rec.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {records.length === 0 && (
          <p className="text-center py-6 text-gray-500">
            No attendance records found.
          </p>
        )}
      </div>
    </div>
  );
}