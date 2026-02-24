import { useState } from "react";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "1234";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setError("");
      onLogin();
      return;
    }

    setError("Invalid credentials. Please use admin credentials.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Welcome Back</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">HRMS Admin Login</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to continue to your dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="admin@gmail.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="••••"
            />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
          Demo credentials: <span className="font-semibold">admin@gmail.com</span> / <span className="font-semibold">1234</span>
        </div>
      </div>
    </div>
  );
}
