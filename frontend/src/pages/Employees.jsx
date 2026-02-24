import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const fetchEmployees = async () => {
    const res = await API.get("/employees/");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/employees/", form);

      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });

      fetchEmployees();
    } catch (err) {
      console.log(err.response?.data);
      alert("Error: " + JSON.stringify(err.response?.data));
    }
  };

  const deleteEmployee = async (id) => {
    await API.delete(`/employees/${id}`);
    fetchEmployees();
  };

  

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Employee Management
      </h2>

      {/* Add Employee */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
        <h3 className="text-xl font-semibold mb-4">
          Add New Employee
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4"
        >
          <input
            placeholder="Employee ID"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.employee_id}
            onChange={(e) =>
              setForm({ ...form, employee_id: e.target.value })
            }
            required
          />

          <input
            placeholder="Full Name"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
            required
          />

          <input
            placeholder="Email"
            type="email"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            placeholder="Department"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition shadow"
          >
            ➕ Add Employee
          </button>
        </form>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Full Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Department</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, index) => (
              <tr
                key={emp._id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="p-4">{emp.employee_id}</td>
                <td className="p-4 font-medium">
                  {emp.full_name}
                </td>
                <td className="p-4">{emp.email}</td>
                <td className="p-4">{emp.department}</td>
                <td className="p-4">
                  <button
                    onClick={() =>
                      deleteEmployee(emp.employee_id)
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {employees.length === 0 && (
          <p className="text-center py-6 text-gray-500">
            No employees found.
          </p>
        )}
      </div>
    </div>
  );
}