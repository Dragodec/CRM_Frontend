// src/components/TodoModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { apiRequest } from "../../api"; // Import the apiRequest function

const eventTypes = [
  "LEAD_FOLLOW_UP",
  "CONTACT_CUSTOMER",
  "UPDATE_SALES",
  "PRODUCT_CHECK",
  "ORDER_LOOKUP",
];

const gradientPrimary =
  "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white";
const gradientDelete =
  "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white";

export default function TodoModal({ isOpen, onClose, onSave, initialData, onDelete }) {
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    allDay: false,
    completed: false,
    eventType: "LEAD_FOLLOW_UP",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        startDate: initialData.startDate
          ? initialData.startDate.substring(0, 16)
          : "",
        endDate: initialData.endDate
          ? initialData.endDate.substring(0, 16)
          : "",
        allDay: initialData.allDay || false,
        completed: initialData.completed ?? false,
        eventType: initialData.eventType || "LEAD_FOLLOW_UP",
      });
    } else {
      setForm({
        title: "",
        startDate: "",
        endDate: "",
        allDay: false,
        completed: false,
        eventType: "LEAD_FOLLOW_UP",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
  let payload = {
    title: form.title,
    startDate: form.startDate || null,
    endDate: form.endDate || null,
    allDay: form.allDay,
    eventType: form.eventType,
    completed: initialData ? form.completed : undefined,
  };
  onSave(payload);
  // onClose will be handled in parent after save succeeds
};

const handleDelete = async () => {
  if (!initialData?.id) return;
  try {
    await apiRequest(`todos/${initialData.id}`, "DELETE");
    onDelete(initialData.id); // parent will remove it from state
  } catch (err) {
    console.error("Failed to delete todo:", err);
    alert(`Failed to delete: ${err.message}`);
  } finally {
    onClose();
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 rounded-lg w-full max-w-md p-6 relative shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <FaTimes />
            </button>
            
            {/* Title */}
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              {initialData ? "Edit Todo" : "Create Todo"}
            </h2>
            
            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Todo title"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allDay"
                  checked={form.allDay}
                  onChange={handleChange}
                />
                <label className="text-gray-300">All Day</label>
              </div>
              {initialData && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="completed"
                    checked={form.completed}
                    onChange={handleChange}
                  />
                  <label className="text-gray-300">Completed</label>
                </div>
              )}
              <div>
                <label className="block text-gray-300 mb-1">Event Type</label>
                <select
                  name="eventType"
                  value={form.eventType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex gap-3 mt-6">
              {initialData && (
                <button
                  onClick={handleDelete}
                  className={`${gradientDelete} flex-1 py-2 rounded font-semibold`}
                >
                  Delete
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`${gradientPrimary} flex-1 py-2 rounded font-semibold`}
              >
                {initialData ? "Save Changes" : "Create"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}