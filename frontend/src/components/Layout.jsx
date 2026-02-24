import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

const navItems = [
  { path: "/", label: "Dashboard", icon: "◻" },
  { path: "/employees", label: "Employees", icon: "◌" },
  { path: "/attendance", label: "Attendance", icon: "☑" },
];

export default function Layout({ children, onLogout }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const title = useMemo(() => {
    const active = navItems.find((item) => item.path === location.pathname);
    return active?.label ?? "HRMS";
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 md:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-blue-950/40 bg-gradient-to-b from-slate-950 to-slate-900 text-slate-200 transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-5">
          <div className="mb-8 border-b border-white/10 pb-6">
            <h1 className="text-4xl font-bold md:text-5xl text-white">
              HRMS <span className="text-blue-500">Lite</span>
            </h1>
            <p className="mt-1 text-xl text-slate-400">
              Human Resource Management
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xl transition ${
                    active
                      ? "bg-slate-700/50 text-blue-400"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
              A
            </div>
            <div>
              <p className="font-semibold text-white">Admin</p>
              <p className="text-sm text-slate-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="close sidebar"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="flex-1 md:min-h-screen">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 md:hidden"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>
            <p className="text-lg font-semibold md:hidden">{title}</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-gray-500 md:block">
              HRMS Admin Panel
            </p>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}