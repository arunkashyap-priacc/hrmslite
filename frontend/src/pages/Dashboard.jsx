import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        const [employeeRes, attendanceRes] = await Promise.all([
          API.get("/employees/"),
          API.get("/attendance/"),
        ]);

        setEmployees(employeeRes.data);
        setAttendance(attendanceRes.data);
      } catch {
        setEmployees([]);
        setAttendance([]);
      }
    };

    load();
  }, []);

  const employeeNameById = useMemo(() => {
    return employees.reduce((map, employee) => {
      map[employee.employee_id] = employee.full_name;
      return map;
    }, {});
  }, [employees]);

  const todayStats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    const todayRecords = attendance.filter(
      (item) =>
        String(item.date).slice(0, 10) === today
    );

    const present = todayRecords.filter(
      (item) => item.status === "Present"
    ).length;

    return {
      present,
      absent: Math.max(
        todayRecords.length - present,
        0
      ),
      totalRecords: attendance.length,
    };
  }, [attendance]);

  const filteredRecentAttendance = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attendance
      .slice()
      .reverse()
      .filter((item) => {
        const employeeName =
          employeeNameById[item.employee_id] || "";

        const matchesSearch =
          query.length === 0 ||
          String(item.employee_id)
            .toLowerCase()
            .includes(query) ||
          employeeName
            .toLowerCase()
            .includes(query) ||
          String(item.date)
            .slice(0, 10)
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          item.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .slice(0, 6);
  }, [
    attendance,
    search,
    statusFilter,
    employeeNameById,
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h2 className="text-5xl font-bold text-slate-900">
          Dashboard
        </h2>
        <p className="text-2xl text-slate-600">
          Overview of your HR operations
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <StatCard
          title="Total Employees"
          value={employees.length}
          accent="border-blue-500"
        />
        <StatCard
          title="Present Today"
          value={todayStats.present}
          accent="border-emerald-500"
        />
        <StatCard
          title="Absent Today"
          value={todayStats.absent}
          accent="border-red-500"
        />
        <StatCard
          title="Total Records"
          value={todayStats.totalRecords}
          accent="border-teal-500"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-3xl font-semibold text-slate-900">
            Recent Attendance
          </h3>

          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <input
              type="text"
              placeholder="Search employee/date"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">
                All Status
              </option>
              <option value="Present">
                Present
              </option>
              <option value="Absent">
                Absent
              </option>
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filteredRecentAttendance.length ===
            0 && (
            <p className="text-slate-500">
              No attendance records available
              for current filter.
            </p>
          )}

          {filteredRecentAttendance.map(
            (item) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
              >
                <div>
                  <p className="text-lg font-semibold text-slate-800">
                    {employeeNameById[
                      item.employee_id
                    ] ||
                      `Employee #${item.employee_id}`}
                  </p>

                  <p className="text-sm text-slate-500">
                    {String(item.date).slice(
                      0,
                      10
                    )}{" "}
                    · ID: {item.employee_id}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-1 text-sm font-semibold ${
                    item.status ===
                    "Present"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, accent }) {
  return (
    <div
      className={`rounded-2xl border-l-4 ${accent} border border-gray-200 bg-white p-6 shadow-sm`}
    >
      <p className="text-2xl text-slate-600">
        {title}
      </p>
      <p className="mt-3 text-5xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}