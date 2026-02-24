import { motion } from "framer-motion";

export default function EmployeeCard({ emp, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
    >
      <h2 className="text-lg font-semibold">{emp.full_name}</h2>
      <p>{emp.email}</p>
      <p className="text-sm text-gray-500">{emp.department}</p>

      <button
        onClick={() => onDelete(emp.employee_id)}
        className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Delete
      </button>
    </motion.div>
  );
}