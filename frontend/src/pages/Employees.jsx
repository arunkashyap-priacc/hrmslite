import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    department: "",
  });

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees/");
      setEmployees(res.data);
    } catch {
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/employees/", form);
      setForm({ full_name: "", email: "", department: "" });
      await fetchEmployees();
    } catch (err) {
      alert("Error: " + JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await API.delete(`/employees/${id}`);
      fetchEmployees();
    } catch {
      // ignore for UI stability
    }
  };

  const departments = useMemo(() => {
    const unique = new Set(
      employees.map((emp) => emp.department).filter(Boolean)
    );
    return ["All", ...Array.from(unique).sort()];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((emp) => {
      const matchesDepartment =
        departmentFilter === "All" ||
        emp.department === departmentFilter;

      const matchesSearch =
        query.length === 0 ||
        emp.full_name?.toLowerCase().includes(query) ||
        emp.email?.toLowerCase().includes(query) ||
        String(emp.employee_id).toLowerCase().includes(query) ||
        emp.department?.toLowerCase().includes(query);

      return matchesDepartment && matchesSearch;
    });
  }, [employees, search, departmentFilter]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-5xl font-bold text-slate-900">
            Employees
          </h2>
          <p className="text-2xl text-slate-600">
            Manage your team members · {filteredEmployees.length} of{" "}
            {employees.length} employee
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-semibold text-slate-900">
          Add New Employee
        </h3>

        <form
          onSubmit={handleSubmit}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <p className="rounded-xl border border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm text-blue-700 md:col-span-2">
            Employee ID automatically generate hoga (last ID + 1).
          </p>

          <Field
            placeholder="Full Name"
            value={form.full_name}
            onChange={(value) =>
              setForm({ ...form, full_name: value })
            }
          />

          <Field
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(value) =>
              setForm({ ...form, email: value })
            }
          />

          <Field
            placeholder="Department"
            value={form.department}
            onChange={(value) =>
              setForm({ ...form, department: value })
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Adding..." : "+ Add Employee"}
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-gray-200 bg-gray-50 p-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Search by name, email, ID, department"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            value={departmentFilter}
            onChange={(e) =>
              setDepartmentFilter(e.target.value)
            }
            className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {departments.map((department) => (
              <option
                key={department}
                value={department}
              >
                {department === "All"
                  ? "All Departments"
                  : department}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 text-slate-600">
              <tr>
                <th className="px-5 py-4 text-lg font-semibold">
                  Employee ID
                </th>
                <th className="px-5 py-4 text-lg font-semibold">
                  Full Name
                </th>
                <th className="px-5 py-4 text-lg font-semibold">
                  Email
                </th>
                <th className="px-5 py-4 text-lg font-semibold">
                  Department
                </th>
                <th className="px-5 py-4 text-lg font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp, index) => (
                <tr
                  key={emp._id}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/70"
                  }
                >
                  <td className="px-5 py-4">
                    {emp.employee_id}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {emp.full_name}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {emp.email}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        deleteEmployee(
                          emp.employee_id
                        )
                      }
                      className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <p className="py-6 text-center text-slate-500">
            No employees found for current
            search/filter.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  placeholder,
  type = "text",
  value,
  onChange,
}) {
  return (
    <input
      required
      type={type}
      placeholder={placeholder}
      className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
    />
  );
}