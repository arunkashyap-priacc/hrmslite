import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    API.get("/employees/").then((res) => {
      setCount(res.data.length);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Dashboard
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-600">
          <h3 className="text-gray-500">Total Employees</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
}