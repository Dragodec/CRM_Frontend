// src/pages/CustomerViewPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaCheckCircle, FaTimesCircle, FaCopy } from "react-icons/fa";
import { apiRequest } from "../api";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import UpdateCustomerModal from "../components/Customer/UpdateCustomerModal";
import TabSwitcher from "../components/Customer/TabSwitcher";

const gradientEdit = "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white";
const gradientDelete = "bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white";

export default function CustomerViewPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCustomer = useCallback(async () => {
    if (!id) return;
    try {
      const data = await apiRequest(`customers/${id}`, "GET");
      data.createdAt = new Date(data.createdAt);
      data.updatedAt = new Date(data.updatedAt);
      setCustomer(data);
    } catch (err) {
      setError(err.message || "Failed to load customer.");
    }
  }, [id]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  const handleEdit = () => setIsModalOpen(true);

  const handleDeactivate = async () => {
    if (!customer) return;
    try {
      await apiRequest(`customers/${customer.id}?active=false`, "PATCH");
      toast.success("Customer deactivated!");
      loadCustomer();
    } catch (err) {
      toast.error(err.message || "Failed to deactivate customer.");
    }
  };

  if (error) return <ErrorMessage message={error} />;
  if (!customer) return <LoadingMessage />;

  const initials = customer.name?.[0].toUpperCase() || "?";
  const avatarBg = "bg-gray-600";

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard!"));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start px-4 py-10 text-gray-200">
      <h1 className="text-4xl font-extrabold mb-8 text-purple-400">Customer Information</h1>

      {/* Customer Card */}
      <motion.div
        className="bg-gray-800 rounded-3xl shadow-xl max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Left Section */}
        <div className="bg-gray-700 p-10 flex flex-col items-center justify-center space-y-6 border-r border-gray-600">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center text-6xl font-bold text-white select-none ${avatarBg}`} title={customer.name}>
            {initials}
          </div>
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-gray-200 select-text">{customer.name}</h2>
            <button aria-label="Copy name" onClick={() => copyToClipboard(customer.name)} className="text-gray-400 hover:text-gray-100 focus:outline-none">
              <FaCopy />
            </button>
          </div>
          <div className="flex items-center space-x-3 mt-6">
            {customer.active ? <FaCheckCircle className="text-green-500 text-2xl" title="Active Customer" /> : <FaTimesCircle className="text-red-500 text-2xl" title="Inactive Customer" />}
            <span className={`font-semibold text-lg ${customer.active ? "text-green-400" : "text-red-400"}`}>{customer.active ? "Active" : "Inactive"}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:col-span-2 p-10 space-y-8 relative">
          <div className="absolute top-6 right-6 flex gap-4 flex-wrap justify-end">
            <button className={`px-4 py-2 rounded-lg ${gradientEdit}`} onClick={handleEdit}>Edit</button>
            <button className={`px-4 py-2 rounded-lg ${gradientDelete}`} onClick={handleDeactivate}>
              {customer.active ? "Deactivate" : "Inactive"}
            </button>
          </div>

          <p className="text-2xl font-semibold text-gray-200">
            Customer: <span className="capitalize underline decoration-purple-400 decoration-2">{customer.name}</span>
          </p>

          <section>
            <h3 className="text-xl font-bold text-gray-200 mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
              <InfoItem label="ID" value={customer.id} />
              <InfoItem label="Name" value={customer.name} />
              <InfoItem label="Company" value={customer.companyName} />
              <InfoItem icon={<FaEnvelope />} label="Email" value={customer.email} onCopy={() => copyToClipboard(customer.email)} />
              <InfoItem label="Phone" value={customer.phone || "-"} />
              <InfoItem label="Sales Rep" value={customer.salesRepName || "-"} />
              <InfoItem label="Status" value={customer.active ? "Active" : "Inactive"} icon={customer.active ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />} />
            </div>
          </section>
        </div>
      </motion.div>

      {/* Tab Switcher */}
      <div className="mt-10 w-full max-w-5xl">
        <TabSwitcher customerId={customer.id} />
      </div>

      {/* Update Modal */}
      <UpdateCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={customer}
        onCustomerUpdated={loadCustomer}
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
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Customer Information</h1>
      <p className="text-red-600">Error: {message}</p>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Customer Information</h1>
      <p>Loading Customer Information...</p>
    </div>
  );
}
