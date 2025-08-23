import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "../../api";
import { toast } from "react-toastify";
import UpdateOrderModal from "./UpdateOrderModal"; // import the update modal

const gradientClose =
  "bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white";
const gradientEdit =
  "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white";
const gradientDelete =
  "bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white";

const modalBackdrop =
  "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";
const modalContainer =
  "bg-gray-900 p-6 rounded-2xl shadow-xl max-w-3xl w-full relative";

const ViewOrderModal = ({ id, onClose, onOrderUpdated }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // toggle update modal

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(`orders/${id}`, "GET");
        setOrder(data);
      } catch (err) {
        toast.error("Failed to load order");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, onClose]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    setDeleting(true);
    try {
      await apiRequest(`orders/${id}`, "DELETE"); // fixed endpoint
      toast.success("Order deleted successfully");
      onOrderUpdated?.();
      onClose();
    } catch (err) {
      toast.error("Failed to delete order");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // open UpdateOrderModal
  };

  const handleUpdateClose = () => {
    setIsEditing(false);
    // refetch updated order after modal closes
    if (id) {
      apiRequest(`orders/${id}`, "GET")
        .then((data) => setOrder(data))
        .catch(() => toast.error("Failed to refresh order"));
    }
  };

  return (
    <>
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
              ) : order ? (
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl font-bold text-gray-100 text-center">
                    Order Details
                  </h2>
                  {/* Order Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 font-semibold">Customer Name</p>
                      <p className="text-gray-100">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">Customer Email</p>
                      <p className="text-gray-100">{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">Created By</p>
                      <p className="text-gray-100">{order.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">Status</p>
                      <p className="text-gray-100">{order.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">Total Amount</p>
                      <p className="text-gray-100">${order.totalAmount?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">Created At</p>
                      <p className="text-gray-100">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">Updated At</p>
                      <p className="text-gray-100">
                        {new Date(order.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <p className="text-gray-400 font-semibold mb-2">Order Items</p>
                    {order.items?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-gray-100 border border-gray-700 rounded-lg">
                          <thead className="bg-gray-800">
                            <tr>
                              <th className="px-4 py-2 border-b border-gray-700">Product</th>
                              <th className="px-4 py-2 border-b border-gray-700">Code</th>
                              <th className="px-4 py-2 border-b border-gray-700">Qty</th>
                              <th className="px-4 py-2 border-b border-gray-700">Price</th>
                              <th className="px-4 py-2 border-b border-gray-700">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item.id} className="hover:bg-gray-800">
                                <td className="px-4 py-2">{item.productName}</td>
                                <td className="px-4 py-2">{item.productCode}</td>
                                <td className="px-4 py-2">{item.quantity}</td>
                                <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                                <td className="px-4 py-2">${item.subtotal?.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-400">No items found.</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className={`px-4 py-2 rounded-lg ${gradientEdit}`}
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg ${gradientDelete}`}
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg ${gradientClose}`}
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center">Order not found.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render UpdateOrderModal when editing */}
      {isEditing && order && (
        <UpdateOrderModal
          isOpen={isEditing}
          onClose={handleUpdateClose}
          orderId={order.id}
          orderData={order}
          onOrderUpdated={() => {
            onOrderUpdated?.();
            handleUpdateClose();
          }}
        />
      )}
    </>
  );
};

export default ViewOrderModal;
