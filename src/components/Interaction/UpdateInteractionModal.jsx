import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { apiRequest } from "../../api";

const gradientSubmit =
  "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white";

const interactionTypes = ["CALL", "EMAIL", "MEETING", "NOTE"];

export default function UpdateInteractionModal({ isOpen, onClose, interactionId, interactionData, onInteractionUpdated }) {
  const [formData, setFormData] = useState({
    type: "",
    details: "",
    createdByName: "",
    active: true, // default true
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Load initial data when modal opens
  useEffect(() => {
    if (!isOpen || !interactionData) return;
    setFormData({
      type: interactionData.type || "",
      details: interactionData.details || "",
      createdByName: interactionData.createdByName || "",
      active: interactionData.active !== undefined ? interactionData.active : true,
    });
  }, [isOpen, interactionData]);

  // Fetch users for dropdown
  useEffect(() => {
    if (!isOpen) return;
    const fetchUsers = async () => {
      try {
        const data = await apiRequest("users/names");
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiRequest(`interactions/${interactionId}`, "PUT", formData);
      onInteractionUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold text-purple-400 mb-4">Update Interaction</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Interaction Type Dropdown */}
              <div>
                <label className="block text-gray-300 mb-1">Interaction Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="" disabled>Select type</option>
                  {interactionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Details */}
              <div>
                <label className="block text-gray-300 mb-1">Details</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Created By Dropdown */}
              <div>
                <label className="block text-gray-300 mb-1">Created By</label>
                <select
                  name="createdByName"
                  value={formData.createdByName}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {users.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${gradientSubmit} font-bold py-2 px-4 rounded-lg mt-2`}
              >
                {loading ? "Updating..." : "Update Interaction"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
