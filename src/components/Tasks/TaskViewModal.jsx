import React from "react";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const gradientEdit = "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white";
const gradientDelete = "bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white";

export default function TaskViewModal({ task, onClose, onEdit, onDelete }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FaTimes size={20} />
        </button>

        {/* Modal header */}
        <h2 className="text-2xl font-bold text-white mb-4">{task.title}</h2>

        {/* Task details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-300">
          <div>
            <p className="font-semibold text-gray-400">Description:</p>
            <p className="mt-1 break-words">{task.description || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-400">Status:</p>
            <p className="mt-1">{task.status}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-400">Priority:</p>
            <p className="mt-1">{task.priority}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-400">Due Date:</p>
            <p className="mt-1">
              {task.dueDate ? new Date(task.dueDate).toLocaleString() : "-"}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-400">Customer:</p>
            <p className="mt-1">{task.customerName || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-400">Assigned To:</p>
            <p className="mt-1">{task.assignedToName || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-400">Created At:</p>
            <p className="mt-1">
              {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-400">Updated At:</p>
            <p className="mt-1">
              {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : "-"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => onEdit(task.id)}
            className={`${gradientEdit} flex items-center gap-2 px-4 py-2 rounded-lg font-semibold`}
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className={`${gradientDelete} flex items-center gap-2 px-4 py-2 rounded-lg font-semibold`}
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
