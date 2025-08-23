// src/components/Lead/UpdateLeadModal.jsx
import React, { useState, useEffect } from "react";
import { apiRequest } from "../../api";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

const gradientSave = "bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white";
const gradientCancel = "bg-gray-600 hover:bg-gray-700 text-white";

export default function UpdateLeadModal({ isOpen, onClose, lead, onLeadUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    assignedToName: "",
    status: "NEW",
    active: true,
  });
  const [salesRepNames, setSalesRepNames] = useState([]);
  const [statusOptions] = useState(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        companyName: lead.companyName || "",
        assignedToName: lead.salesRepName || "",
        status: lead.status || "NEW",
        active: lead.active !== undefined ? lead.active : true,
      });
    }
  }, [lead]);

  useEffect(() => {
    // Fetch sales rep names for dropdown
    const fetchSalesRepNames = async () => {
      try {
        const names = await apiRequest("users/names", "GET");
        setSalesRepNames(names);
      } catch (err) {
        toast.error("Failed to load sales reps");
      }
    };
    if (isOpen) fetchSalesRepNames();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest(`leads/${lead.id}`, "PUT", formData);
      toast.success("Lead updated successfully!");
      onLeadUpdated();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update lead");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-purple-400">Update Lead</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-200 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-1">Company</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-1">Assigned Sales Rep</label>
            <select
              name="assignedToName"
              value={formData.assignedToName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200"
              required
            >
              <option value="">Select Sales Rep</option>
              {salesRepNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-200 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="text-gray-200">Active</label>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${gradientCancel}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg ${gradientSave}`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
