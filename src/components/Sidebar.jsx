import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaBullhorn,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaChartLine,
  FaBox,
} from "react-icons/fa";
import { apiRequest } from "../api";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = async () => {
  setLoggingOut(true);
  try {
    await apiRequest("auth/logout", "POST");
  } catch (error) {
    console.error("Logout failed", error);
  } finally {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
    setIsOpen(false);
    setLoggingOut(false);
  }
};

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-gray-700 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  // Roles allowed to see Analyst page
  const canViewAnalyst = ["ANALYST", "ADMIN", "SUPER_ADMIN"].includes(role);

  // Desktop links
  const renderDesktopLinks = () => (
    <nav className="flex flex-col gap-2">
      <NavLink to="/dashboard" className={linkClasses}>
        <FaChartLine />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/customers" className={linkClasses}>
        <FaUser />
        <span>Customers</span>
      </NavLink>

      <NavLink to="/leads" className={linkClasses}>
        <FaBullhorn />
        <span>Leads</span>
      </NavLink>

      <NavLink to="/products" className={linkClasses}>
        <FaBox />
        <span>Products</span>
      </NavLink>

      {(role === "SUPER_ADMIN" || role === "ADMIN") && (
        <NavLink to="/users" className={linkClasses}>
          <FaUsers />
          <span>Users</span>
        </NavLink>
      )}

      {canViewAnalyst && (
        <NavLink to="/analyst" className={linkClasses}>
          <FaChartLine />
          <span>Analyst</span>
        </NavLink>
      )}
    </nav>
  );

  // Mobile links
  const renderMobileLinks = () => (
    <nav className="flex flex-col gap-2">
      <NavLink to="/dashboard" className={linkClasses} onClick={() => setIsOpen(false)}>
        <FaChartLine />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/customers" className={linkClasses} onClick={() => setIsOpen(false)}>
        <FaUser />
        <span>Customers</span>
      </NavLink>

      <NavLink to="/leads" className={linkClasses} onClick={() => setIsOpen(false)}>
        <FaBullhorn />
        <span>Leads</span>
      </NavLink>

      <NavLink to="/products" className={linkClasses} onClick={() => setIsOpen(false)}>
        <FaBox />
        <span>Products</span>
      </NavLink>

      {(role === "SUPER_ADMIN" || role === "ADMIN") && (
        <NavLink to="/users" className={linkClasses} onClick={() => setIsOpen(false)}>
          <FaUsers />
          <span>Users</span>
        </NavLink>
      )}

      {canViewAnalyst && (
        <NavLink to="/analyst" className={linkClasses} onClick={() => setIsOpen(false)}>
          <FaChartLine />
          <span>Analyst</span>
        </NavLink>
      )}
    </nav>
  );

  const renderMobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobileSidebar"
          initial={{ x: "-100%" }}
          animate={{ x: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }}
          exit={{ x: "-100%", transition: { duration: 0.3 } }}
          className="fixed inset-0 z-50 bg-gray-900 flex flex-col p-5 md:hidden overflow-y-auto"
        >
          <button
            className="self-end text-2xl text-gray-400 mb-5"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>

          <h1 className="text-3xl font-bold text-white mb-10 text-center">
            Engage<span className="text-gray-400">X</span>
          </h1>

          {renderMobileLinks()}

          <div className="mt-6 border-t border-gray-700 pt-4 flex flex-col gap-3">
            <NavLink
              to="/profile"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <FaUserCircle className="text-xl" />
              <span>Profile</span>
            </NavLink>

            <button onClick={handleLogout} disabled={loggingOut} className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-gray-800">
            <FaSignOutAlt className="text-xl" />
            <span>{loggingOut ? "Logging out..." : "Logout"}</span>
          </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-3 text-gray-300 text-2xl fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <FaBars />
      </button>

      {/* Mobile Sidebar */}
      {renderMobileSidebar()}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-gray-900 p-5 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-8">
          Engage<span className="text-gray-400">X</span>
        </h1>
        {renderDesktopLinks()}

        <div className="flex-1"></div>

        <div className="border-t border-gray-700 pt-4 flex flex-col gap-3">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <FaUserCircle className="text-xl" />
            <span>Profile</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-gray-800"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
