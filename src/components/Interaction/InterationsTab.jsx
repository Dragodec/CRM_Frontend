import React, { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../../api";
import { toast } from "react-toastify";
import { FaEye, FaPlus } from "react-icons/fa";
import ViewInteractionModal from "./ViewInteractionModal";
import CreateInteractionModal from "./CreateInteractionModal";

const gradientView =
  "bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white";
const gradientCreate =
  "bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white";

const InteractionsTab = ({ customerId }) => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInteractionId, setSelectedInteractionId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchInteractions = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await apiRequest(`interactions/customer/${customerId}`);
      setInteractions(data);
    } catch (err) {
      toast.error("Failed to load interactions");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  return (
    <div className="relative p-4">
      {/* Create button on top-right */}
      <div className="flex justify-end mb-4">
        <button
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${gradientCreate}`}
          onClick={() => setIsCreateOpen(true)}
        >
          <FaPlus /> Create Interaction
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : interactions.length === 0 ? (
        <p className="text-gray-400 text-center">No interactions found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {interactions.map((i) => (
            <div
              key={i.id}
              className="bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-md hover:bg-gray-800 transition-colors flex flex-col justify-between"
            >
              <div className="mb-4">
                <p className="text-gray-300 font-semibold">
                  Type: <span className="text-gray-100">{i.type}</span>
                </p>
                <p className="text-gray-300 font-semibold">
                  Created By: <span className="text-gray-100">{i.createdByName}</span>
                </p>
              </div>
              <button
                className={`mt-auto px-3 py-1 rounded-lg flex items-center justify-center gap-2 ${gradientView}`}
                onClick={() => setSelectedInteractionId(i.id)}
              >
                <FaEye /> View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Render View Modal */}
      {selectedInteractionId && (
        <ViewInteractionModal
          id={selectedInteractionId}
          onClose={() => setSelectedInteractionId(null)}
        />
      )}

      {/* Render Create Modal */}
      {isCreateOpen && (
        <CreateInteractionModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          customerId={customerId}
          onInteractionCreated={fetchInteractions} // refresh after create
        />
      )}
    </div>
  );
};

export default InteractionsTab;
