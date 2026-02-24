import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkStyle = (path) =>
    `px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-white text-blue-600 font-semibold"
        : "hover:bg-blue-500"
    }`;

  return (
    <div className="bg-blue-600 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4 text-white">
        <h1 className="text-2xl font-bold">HRMS</h1>
        <div className="flex gap-4">
          <Link to="/" className={linkStyle("/")}>
            Dashboard
          </Link>
          <Link to="/employees" className={linkStyle("/employees")}>
            Employees
          </Link>
          <Link to="/attendance" className={linkStyle("/attendance")}>
  Attendance
</Link>
        </div>
      </div>
    </div>
  );
}