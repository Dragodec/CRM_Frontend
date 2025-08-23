import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { apiRequest } from "../../api";

const gradientButton = "bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white";

const leadStatuses = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];

export default function CreateLeadModal({ isOpen, onClose, onLeadCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [assignedToName, setAssignedToName] = useState("");
  const [status, setStatus] = useState("NEW");
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchSalesReps = async () => {
      try {
        const data = await apiRequest("users/names");
        setSalesReps(data || []);
      } catch (err) {
        toast.error("Failed to fetch sales reps");
      }
    };

    fetchSalesReps();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !assignedToName) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("leads", "POST", {
        name,
        email,
        phone,
        companyName,
        assignedToName,
        status,
        active: true,
      });
      toast.success("Lead created successfully");
      onLeadCreated?.();
      onClose();
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setCompanyName("");
      setAssignedToName("");
      setStatus("NEW");
    } catch (err) {
      toast.error("Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">Create Lead</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 mb-1">Name*</label>
            <input
              className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email*</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Phone</label>
            <input
              className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Company</label>
            <input
              className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-900"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Assigned Sales Rep*</label>
            <select
              className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-900"
              value={assignedToName}
              onChange={(e) => setAssignedToName(e.target.value)}
              required
            >
              <option value="">Select Sales Rep</option>
              {salesReps.map((rep) => (
                <option key={rep} value={rep}>
                  {rep}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-900"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {leadStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex justify-center items-center gap-2 px-4 py-2 rounded-lg font-semibold ${gradientButton}`}
          >
            {loading ? "Creating..." : "Create Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}
