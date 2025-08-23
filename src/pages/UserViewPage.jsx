import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaRegIdBadge, FaCheckCircle, FaTimesCircle, FaCopy } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "../api";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import UpdateUserModal from "../components/User/UpdateUserModal";

const gradientEdit = "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white";
const gradientDelete = "bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white";

export default function UserViewPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useCallback to avoid useEffect warnings
  const loadProfile = useCallback(async () => {
    if (!id) return;
    try {
      const data = await apiRequest(`users/${id}`, "GET");
      data.createdAt = new Date(data.createdAt);
      data.updatedAt = new Date(data.updatedAt);
      setProfile(data);
    } catch (err) {
      setError(err.message || "Failed to load profile.");
    }
  }, [id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleEdit = () => setIsModalOpen(true);

  const handleDelete = async () => {
  if (!profile) return;
  try {
    await apiRequest(`users/${profile.id}?active=false`, "PATCH");
    toast.success("User deactivated!");
    loadProfile(); // refresh profile after patch
  } catch (err) {
    toast.error(err.message || "Failed to deactivate user.");
  }
};

  if (error) return <ErrorMessage message={error} />;
  if (!profile) return <LoadingMessage />;

  const initials = profile.name?.[0].toUpperCase() || "?";
  const roleColors = { ADMIN: "bg-red-600", MANAGER: "bg-blue-600", USER: "bg-purple-600" };
  const avatarBg = roleColors[profile.role] || "bg-gray-600";
  const roleDescriptions = {
  SUPER_ADMIN: "Has full access to all system settings, user management, and critical configurations.",
  ADMIN: "Manages users, system settings, and general administrative tasks.",
  SALES_REP: "Handles customer interactions, manages leads, and tracks sales activities.",
  ANALYST: "Analyzes data, generates reports, and provides insights for decision-making."
};

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard!"));
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start px-4 py-10 text-gray-200">
      <h1 className="text-4xl font-extrabold mb-8 text-purple-400">User Information</h1>

      <motion.div
        className="bg-gray-800 rounded-3xl shadow-xl max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Left Section */}
        <div className="bg-gray-700 p-10 flex flex-col items-center justify-center space-y-6 border-r border-gray-600">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center text-6xl font-bold text-white select-none ${avatarBg}`} title={profile.name}>
            {initials}
          </div>
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-gray-200 select-text">{profile.name}</h2>
            <button aria-label="Copy name" onClick={() => copyToClipboard(profile.name)} className="text-gray-400 hover:text-gray-100 focus:outline-none">
              <FaCopy />
            </button>
          </div>
          <Tooltip text={roleDescriptions[profile.role] || "Role information"}>
            <span className={`inline-block px-4 py-1 rounded-full text-white font-semibold select-none cursor-help ${avatarBg}`}>
              {profile.role}
            </span>
          </Tooltip>
          <div className="flex items-center space-x-3 mt-6">
            {profile.active ? <FaCheckCircle className="text-green-500 text-2xl" title="Active User" /> : <FaTimesCircle className="text-red-500 text-2xl" title="Inactive User" />}
            <span className={`font-semibold text-lg ${profile.active ? "text-green-400" : "text-red-400"}`}>{profile.active ? "Active" : "Inactive"}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:col-span-2 p-10 space-y-8 relative">
          <div className="absolute top-6 right-6 flex gap-4 flex-wrap justify-end">
            <button className={`px-4 py-2 rounded-lg ${gradientEdit}`} onClick={handleEdit}>Edit</button>
            <button className={`px-4 py-2 rounded-lg ${gradientDelete}`} onClick={handleDelete}>
              {profile.active ? "Deactivate" : "Inactive"}
            </button>
          </div>

          <p className="text-2xl font-semibold text-gray-200">
            Welcome back, <span className="capitalize underline decoration-purple-400 decoration-2">{profile.name}</span>!
          </p>

          <section>
            <h3 className="text-xl font-bold text-gray-200 mb-4">Account Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
              <InfoItem icon={<FaEnvelope />} label="Email" value={profile.email} onCopy={() => copyToClipboard(profile.email)} />
              <InfoItem label="Name" value={profile.name} />
              <InfoItem label="Account Created" value={formatDistanceToNow(profile.createdAt, { addSuffix: true })} icon={<FaRegIdBadge />} />
              <InfoItem label="Last Updated" value={formatDistanceToNow(profile.updatedAt, { addSuffix: true })} icon={<FaRegIdBadge />} />
              <InfoItem label="Status" value={profile.active ? "Active" : "Inactive"} icon={profile.active ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />} />
            </div>
          </section>
        </div>
      </motion.div>

      {/* Update User Modal */}
      <UpdateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={profile}
        onUserUpdated={loadProfile} // refresh profile after edit
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

function Tooltip({ children, text }) {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10">
        {text}
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="p-6 bg-gray-900 text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">User Information</h1>
      <p className="text-red-600">Error: {message}</p>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">User Information</h1>
      <p>Loading User Information...</p>
    </div>
  );
}
