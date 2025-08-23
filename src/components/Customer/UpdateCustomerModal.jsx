// src/components/Customer/UpdateCustomerModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { apiRequest } from "../../api";

export default function UpdateCustomerModal({ isOpen, onClose, customer, onCustomerUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    salesRepName: "",
  });
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [salesReps, setSalesReps] = useState([]);

  // Populate form when modal opens
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        companyName: customer.companyName || "",
        email: customer.email || "",
        phone: customer.phone || "",
        salesRepName: customer.salesRepName || "",
      });
      setActive(customer.active);
    }
  }, [customer, isOpen]);

  // Fetch sales reps for dropdown
  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        const data = await apiRequest("users/names", "GET");
        setSalesReps(data || []);
      } catch (err) {
        console.error("Failed to fetch sales reps", err);
      }
    };
    if (isOpen) fetchSalesReps();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActiveChange = async (e) => {
    const newActive = e.target.checked;
    if (newActive !== active) {
      try {
        await apiRequest(`customers/${customer.id}?active=${newActive}`, "PATCH");
        setActive(newActive);
      } catch (err) {
        console.error("Failed to update active status", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiRequest(`customers/${customer.id}`, "PUT", formData);
      onCustomerUpdated(); // refresh customer data
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update customer");
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

            <h2 className="text-2xl font-bold text-purple-400 mb-4">Update Customer</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Sales Rep</label>
                <select
                  name="salesRepName"
                  value={formData.salesRepName}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">-- Select Sales Rep --</option>
                  {salesReps.map((rep) => (
                    <option key={rep} value={rep}>
                      {rep}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Status Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activeStatus"
                  checked={active}
                  onChange={handleActiveChange}
                  className="h-4 w-4 rounded focus:ring-2 focus:ring-purple-400"
                />
                <label htmlFor="activeStatus" className="text-gray-300">
                  Active
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-gray-900 font-bold py-2 px-4 rounded-lg mt-2"
              >
                {loading ? "Updating..." : "Update Customer"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
