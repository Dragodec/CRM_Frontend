import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEye } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { apiRequest } from "../../api";
import TaskViewModal from "./TaskViewModal";
import CreateTaskModal from "./CreateTaskModal";
import UpdateTaskModal from "./UpdateTaskModal";

const gradientCreate =
  "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white";

const TaskStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};
const statusOrder = [
  TaskStatus.PENDING,
  TaskStatus.IN_PROGRESS,
  TaskStatus.COMPLETED,
  TaskStatus.CANCELLED,
];

const TaskCard = ({ task, onView }) => (
  <motion.div
    layout
    className="bg-gray-800 p-4 rounded-lg shadow mb-4 flex flex-col justify-between cursor-pointer hover:bg-gray-700 transition"
  >
    <div className="mb-2 text-center">
      <div
        className="px-2 py-1 rounded-full text-sm font-medium text-white break-words truncate max-w-[100px] mx-auto"
        style={{
          backgroundColor:
            task.priority === "HIGH"
              ? "#ef4444"
              : task.priority === "MEDIUM"
              ? "#facc15"
              : "#34d399",
        }}
      >
        {task.priority}
      </div>
    </div>
    <div className="font-semibold text-gray-200 text-lg break-words text-center mb-2">
      {task.title}
    </div>
    <div className="flex justify-center">
      <button
        onClick={() => onView(task.id)}
        className="bg-indigo-500 text-white px-2 py-1 rounded flex items-center gap-1"
      >
        <FaEye /> View
      </button>
    </div>
  </motion.div>
);

const Column = ({ status, tasks, onTaskView }) => (
  <Droppable droppableId={status}>
    {(provided) => (
      <div
        {...provided.droppableProps}
        ref={provided.innerRef}
        className="bg-gray-900 p-3 rounded min-h-[400px] flex flex-col"
      >
        <h2 className="font-bold text-center mb-2 bg-gray-800 text-white p-2 rounded">
          {status.replace("_", " ")}
        </h2>
        <AnimatePresence>
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TaskCard task={task} onView={onTaskView} />
                </div>
              )}
            </Draggable>
          ))}
        </AnimatePresence>
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

const TasksTab = ({ customerId }) => {
  const [tasks, setTasks] = useState({
    PENDING: [],
    IN_PROGRESS: [],
    COMPLETED: [],
    CANCELLED: [],
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!customerId) return;
    try {
      const data = await apiRequest(`tasks/active?customerId=${customerId}`, "GET");
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  }, [customerId]);

  const fetchTaskById = async (id) => {
    try {
      const task = await apiRequest(`tasks/${id}`, "GET");
      setSelectedTask(task);
    } catch (err) {
      console.error("Failed to fetch task:", err);
    }
  };

  const handleTaskView = (taskId) => fetchTaskById(taskId);

  const handleEdit = (taskId) => {
    setShowUpdateModal(true);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await apiRequest(`tasks/soft-delete/${taskId}`, "PATCH");
      fetchTasks();
      setSelectedTask(null);
    } catch (err) {
      console.error("Failed to soft delete task:", err);
    }
  };

  const handleModalClose = () => {
    setSelectedTask(null);
    setShowUpdateModal(false);
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    const draggedTaskId = parseInt(draggableId);
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const newTasks = { ...tasks };
    const [movedTask] = newTasks[sourceStatus].splice(source.index, 1);
    movedTask.status = destStatus;
    newTasks[destStatus].splice(destination.index, 0, movedTask);
    setTasks(newTasks);

    try {
      await apiRequest(`tasks/${draggedTaskId}/status?status=${destStatus}`, "PATCH");
    } catch (err) {
      console.error("Failed to update task status:", err);
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="p-4 space-y-4">
      {/* Create Task Button */}
      <div className="flex justify-center mb-4">
        <button
          className={gradientCreate + " px-4 py-2 rounded flex items-center"}
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus className="mr-2" /> Create Task
        </button>
      </div>

      {/* Task Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {statusOrder.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks[status] || []}
              onTaskView={handleTaskView}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Task View Modal */}
      {selectedTask && !showUpdateModal && (
        <TaskViewModal
          task={selectedTask}
          onClose={handleModalClose}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          customerId={customerId}
          onClose={() => setShowCreateModal(false)}
          onCreate={() => fetchTasks()}
        />
      )}

      {/* Update Task Modal */}
      {showUpdateModal && selectedTask && (
        <UpdateTaskModal
          task={selectedTask}
          onClose={handleModalClose}
          onUpdate={() => fetchTasks()}
        />
      )}
    </div>
  );
};

export default TasksTab;
