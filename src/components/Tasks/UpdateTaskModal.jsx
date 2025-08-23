import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { apiRequest } from "../../api";

const gradientUpdate =
  "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white";

const TaskPriority = ["LOW", "MEDIUM", "HIGH"];
const TaskStatus = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const UpdateTaskModal = ({ task, onClose, onUpdate }) => {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "MEDIUM");
  const [status, setStatus] = useState(task.status || "PENDING");
  const [assignedToName, setAssignedToName] = useState(task.assignedToName || "");
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split("T")[0] : "");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users for assignedTo dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiRequest("users/names", "GET");
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !assignedToName) return;

    setLoading(true);
    try {
      const body = {
        title,
        description,
        priority,
        status,
        assignedToName,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        active: true, // always true
      };

      // Normal update PUT
      await apiRequest(`tasks/${task.id}`, "PUT", body);

      onUpdate(); // callback to refresh list
      onClose();
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold text-white mb-4 text-center">Update Task</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label className="block text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {TaskStatus.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {TaskPriority.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-gray-300 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-gray-300 mb-1">Assign To</label>
            <select
              value={assignedToName}
              onChange={(e) => setAssignedToName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={`${gradientUpdate} w-full py-2 rounded font-semibold`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTaskModal;
