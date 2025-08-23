// src/pages/LeadViewPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaCheckCircle, FaTimesCircle, FaCopy } from "react-icons/fa";
import { apiRequest } from "../api";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import UpdateLeadModal from "../components/Lead/UpdateLeadModal";

const gradientEdit = "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white";
const gradientDelete = "bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white";

export default function LeadViewPage() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadLead = useCallback(async () => {
    if (!id) return;
    try {
      const data = await apiRequest(`leads/${id}`, "GET");
      setLead(data);
    } catch (err) {
      setError(err.message || "Failed to load lead.");
    }
  }, [id]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  const handleEdit = () => setIsModalOpen(true);

  const handleDeactivate = async () => {
    if (!lead) return;
    try {
      await apiRequest(`leads/soft-delete/${lead.id}`, "PATCH");
      toast.success("Lead deactivated!");
      loadLead();
    } catch (err) {
      toast.error(err.message || "Failed to deactivate lead.");
    }
  };

  if (error) return <ErrorMessage message={error} />;
  if (!lead) return <LoadingMessage />;

  const initials = lead.name?.[0].toUpperCase() || "?";
  const avatarBg = "bg-gray-600";

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard!"));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start px-4 py-10 text-gray-200">
      <h1 className="text-4xl font-extrabold mb-8 text-purple-400">Lead Information</h1>

      {/* Lead Card */}
      <motion.div
        className="bg-gray-800 rounded-3xl shadow-xl max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Left Section */}
        <div className="bg-gray-700 p-10 flex flex-col items-center justify-center space-y-6 border-r border-gray-600">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center text-6xl font-bold text-white select-none ${avatarBg}`} title={lead.name}>
            {initials}
          </div>
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-gray-200 select-text">{lead.name}</h2>
            <button aria-label="Copy name" onClick={() => copyToClipboard(lead.name)} className="text-gray-400 hover:text-gray-100 focus:outline-none">
              <FaCopy />
            </button>
          </div>
          <div className="flex items-center space-x-3 mt-6">
            {lead.active ? <FaCheckCircle className="text-green-500 text-2xl" title="Active Lead" /> : <FaTimesCircle className="text-red-500 text-2xl" title="Inactive Lead" />}
            <span className={`font-semibold text-lg ${lead.active ? "text-green-400" : "text-red-400"}`}>{lead.active ? "Active" : "Inactive"}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:col-span-2 p-10 space-y-8 relative">
          <div className="absolute top-6 right-6 flex gap-4 flex-wrap justify-end">
            <button className={`px-4 py-2 rounded-lg ${gradientEdit}`} onClick={handleEdit}>Edit</button>
            <button className={`px-4 py-2 rounded-lg ${gradientDelete}`} onClick={handleDeactivate}>
              {lead.active ? "Deactivate" : "Inactive"}
            </button>
          </div>

          <p className="text-2xl font-semibold text-gray-200">
            Lead: <span className="capitalize underline decoration-purple-400 decoration-2">{lead.name}</span>
          </p>

          <section>
            <h3 className="text-xl font-bold text-gray-200 mb-4">Lead Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
              <InfoItem label="Name" value={lead.name} />
              <InfoItem label="Email" value={lead.email} icon={<FaEnvelope />} onCopy={() => copyToClipboard(lead.email)} />
              <InfoItem label="Phone" value={lead.phone || "-"} />
              <InfoItem label="Company" value={lead.companyName || "-"} />
              <InfoItem label="Sales Rep" value={lead.salesRepName || "-"} />
              <InfoItem label="Status" value={lead.status} />
            </div>
          </section>
        </div>
      </motion.div>

      {/* Update Modal */}
      <UpdateLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lead={lead}
        onLeadUpdated={loadLead}
      />

      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
    </div>
  );
}

// Reusable Components
function InfoItem({ icon, label, value, onCopy }) {
  return (
    <div className="flex items-center gap-4 bg-gray-800 p-3 rounded-md border border-gray-700">
      <div className="text-gray-400 text-xl">{icon}</div>
      <div className="flex-1">
        <p className="font-semibold text-gray-200">{label}</p>
        <p className="break-words">{value || "-"}</p>
      </div>
      {onCopy && (
        <button onClick={onCopy} className="text-gray-400 hover:text-gray-100 focus:outline-none" aria-label={`Copy ${label}`} type="button">
          <FaCopy />
        </button>
      )}
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="p-6 bg-gray-900 text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Lead Information</h1>
      <p className="text-red-600">Error: {message}</p>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Lead Information</h1>
      <p>Loading Lead Information...</p>
    </div>
  );
}
