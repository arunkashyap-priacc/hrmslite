import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState("All");
  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    status: "Present",
  });

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees/");
      setEmployees(res.data);
    } catch {
      setEmployees([]);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance/");
      setRecords(res.data);
    } catch {
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/attendance/", form);
      setForm({ employee_id: "", date: "", status: "Present" });
      fetchAttendance();
    } catch {
      // ignore for UI stability
    }
  };

  const employeeNameById = useMemo(() => {
    return employees.reduce((map, employee) => {
      map[employee.employee_id] = employee.full_name;
      return map;
    }, {});
  }, [employees]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const employeeName =
        employeeNameById[record.employee_id] || "";

      const matchesSearch =
        query.length === 0 ||
        String(record.employee_id)
          .toLowerCase()
          .includes(query) ||
        employeeName.toLowerCase().includes(query) ||
        String(record.date)
          .slice(0, 10)
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      const matchesEmployee =
        employeeFilter === "All" ||
        record.employee_id === employeeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesEmployee
      );
    });
  }, [
    records,
    search,
    statusFilter,
    employeeFilter,
    employeeNameById,
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-5xl font-bold text-slate-900">
            Attendance
          </h2>
          <p className="text-2xl text-slate-600">
            Track daily attendance records
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-semibold text-slate-900">
          Mark Attendance
        </h3>

        <form
          onSubmit={handleSubmit}
          className="mt-4 grid gap-4 md:grid-cols-3"
        >
          <select
            required
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={form.employee_id}
            onChange={(e) =>
              setForm({
                ...form,
                employee_id: e.target.value,
              })
            }
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option
                key={emp._id}
                value={emp.employee_id}
              >
                {emp.full_name} ({emp.employee_id})
              </option>
            ))}
          </select>

          <input
            required
            type="date"
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
          />

          <select
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
          >
            <option>Present</option>
            <option>Absent</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 md:col-span-3"
          >
            Mark Attendance
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-gray-200 bg-gray-50 p-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search by employee/date"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>

          <select
            value={employeeFilter}
            onChange={(e) =>
              setEmployeeFilter(e.target.value)
            }
            className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All Employees</option>
            {employees.map((employee) => (
              <option
                key={employee._id}
                value={employee.employee_id}
              >
                {employee.full_name} (
                {employee.employee_id})
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 text-slate-600">
              <tr>
                <th className="px-5 py-4 text-lg font-semibold">
                  Employee
                </th>
                <th className="px-5 py-4 text-lg font-semibold">
                  Date
                </th>
                <th className="px-5 py-4 text-lg font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((rec, index) => (
                <tr
                  key={rec._id}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/70"
                  }
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">
                      {employeeNameById[
                        rec.employee_id
                      ] || "Unknown"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {rec.employee_id}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {String(rec.date).slice(0, 10)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        rec.status === "Present"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <p className="py-6 text-center text-slate-500">
            No attendance records for current
            search/filter.
          </p>
        )}
      </div>
    </div>
  );
}