import React, { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../api";
import { toast } from "react-toastify";
import { FaEye, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CreateUserModal from "../components/User/CreateUserModal";

const gradientView =
  "bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white";
const gradientCreate =
  "bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append("page", page);
      query.append("size", 10);

      if (search) query.append("search", search); // single param for backend
      if (roleFilter) query.append("role", roleFilter);
      if (activeFilter) query.append("active", activeFilter);

      const data = await apiRequest(`users?${query.toString()}`);
      console.log("Fetched users:", data);
      setUsers(data.content);

    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, activeFilter]);

  // Reset page to 0 when search or filters change
  useEffect(() => {
    setPage(0);
  }, [search, roleFilter, activeFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewUser = useCallback(
    (id) => {
      navigate(`/viewUser/${id}`);
    },
    [navigate]
  );

  const handleUserCreated = () => {
    fetchUsers(); // refresh user list after creating
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      {/* Header + Filters */}
      <div className="flex flex-col mb-6 gap-4">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full">
          <input
            type="text"
            placeholder="Search name or email"
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-900 w-full sm:w-auto flex-grow min-w-[150px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-900 w-full sm:w-auto flex-grow min-w-[120px]"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="SALES_REP">Sales Rep</option>
            <option value="ANALYST">Analyst</option>
          </select>
          <select
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-900 w-full sm:w-auto flex-grow min-w-[120px]"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg w-full sm:w-auto ${gradientCreate}`}
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus /> Create User
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <AnimatePresence>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-200">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Active</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-3 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-3 text-center">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                      <td className="p-3">{user.id}</td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3">{user.active ? "Yes" : "No"}</td>
                      <td className="p-3">
                        <button
                          className={`px-3 py-2 rounded ${gradientView} flex items-center gap-1`}
                          onClick={() => handleViewUser(user.id)}
                        >
                          <FaEye /> View
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AnimatePresence>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-center">No users found</p>
        ) : (
          users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-2"
            >
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Active:</strong> {user.active ? "Yes" : "No"}
              </p>
              <div className="flex mt-2 justify-end">
                <button
                  className={`px-3 py-2 rounded ${gradientView} flex items-center gap-1`}
                  onClick={() => handleViewUser(user.id)}
                >
                  <FaEye /> View
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}
