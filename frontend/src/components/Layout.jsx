import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Layout({ children }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItem = (path, label) => (
    <Link
      to={path}
      onClick={() => setOpen(false)}
      className={`block px-4 py-3 rounded-lg transition ${
        location.pathname === path
          ? "bg-blue-600 text-white"
          : "hover:bg-blue-100"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white shadow-xl p-5 transition-transform ${
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>

        <h2 className="text-2xl font-bold text-blue-600 mb-8">
          HRMS
        </h2>

        <nav className="space-y-2">
          {navItem("/", "Dashboard")}
          {navItem("/employees", "Employees")}
          {navItem("/attendance", "Attendance")}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64">

        {/* Topbar */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <button
            className="md:hidden bg-blue-600 text-white px-3 py-2 rounded-lg"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

          <h1 className="text-xl font-semibold">
            Admin Panel
          </h1>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}