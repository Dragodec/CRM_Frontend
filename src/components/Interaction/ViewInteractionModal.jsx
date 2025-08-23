import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "../../api";
import { toast } from "react-toastify";
import UpdateInteractionModal from "./UpdateInteractionModal";

const gradientEdit =
  "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white";
const gradientDelete =
  "bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white";

const modalBackdrop = "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";
const modalContainer = "bg-gray-900 p-6 rounded-2xl shadow-xl max-w-lg w-full relative";

const ViewInteractionModal = ({ id, onClose, onInteractionUpdated }) => {
  const [interaction, setInteraction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchInteraction = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(`interactions/${id}`);
        setInteraction(data);
      } catch (err) {
        toast.error("Failed to load interaction");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchInteraction();
  }, [id, onClose]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = async () => {
  if (!window.confirm("Are you sure you want to delete this interaction?")) return;

  setDeleting(true);
  try {
    await apiRequest(`interactions/soft-delete/${id}`, "PATCH"); // soft delete
    toast.success("Interaction deleted successfully");
    onInteractionUpdated();
    onClose();
  } catch (err) {
    console.error(err); // Optional: log actual error
    toast.error("Failed to delete interaction");
  } finally {
    setDeleting(false);
  }
};

  const handleUpdateComplete = () => {
    setIsEditing(false);
    onInteractionUpdated(); // refresh the parent list
    onClose(); // close the view modal
  };

  return (
    <AnimatePresence>
      {id && !isEditing && (
        <motion.div
          className={modalBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={modalContainer}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-100 text-xl font-bold"
            >
              &times;
            </button>

            {loading ? (
              <p className="text-gray-400 text-center">Loading...</p>
            ) : interaction ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-gray-100 text-center">
                  Interaction Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-400 font-semibold">Type</p>
                    <p className="text-gray-100">{interaction.type}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 font-semibold">Active</p>
                    <p className="text-gray-100">
                      {interaction.active ? "Yes" : "No"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 font-semibold">Created By</p>
                    <p className="text-gray-100">{interaction.createdByName}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 font-semibold">Customer</p>
                    <p className="text-gray-100">{interaction.customerName}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-gray-400 font-semibold">Details</p>
                    <p className="text-gray-100">{interaction.details}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 font-semibold">Created At</p>
                    <p className="text-gray-100">
                      {new Date(interaction.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 font-semibold">Updated At</p>
                    <p className="text-gray-100">
                      {new Date(interaction.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-4">
                  <button
                    className={`px-4 py-2 rounded-lg ${gradientEdit}`}
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg ${gradientDelete}`}
                    onClick={handleDeleteClick}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center">Interaction not found.</p>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Render UpdateInteractionModal */}
      {isEditing && interaction && (
        <UpdateInteractionModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          interactionId={interaction.id}
          interactionData={interaction}
          onInteractionUpdated={handleUpdateComplete}
        />
      )}
    </AnimatePresence>
  );
};

export default ViewInteractionModal;
