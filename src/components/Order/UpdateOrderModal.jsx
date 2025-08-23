import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { apiRequest } from "../../api";
import { toast } from "react-toastify";

const gradientSubmit =
  "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white";

export default function UpdateOrderModal({
  isOpen,
  onClose,
  orderId,
  orderData,
  onOrderUpdated,
}) {
  const [formData, setFormData] = useState({ status: "", items: [] });
  const [deletedItemIds, setDeletedItemIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load order data when modal opens
  useEffect(() => {
    if (!isOpen || !orderData) return;
    setFormData({
      status: orderData.status || "",
      items:
        orderData.items?.map((item) => ({
          id: item.id,
          productCode: item.productCode,
          quantity: item.quantity,
        })) || [],
    });
    setDeletedItemIds([]); // reset deleted IDs
  }, [isOpen, orderData]);

  // Fetch active products
  useEffect(() => {
    if (!isOpen) return;
    const fetchProducts = async () => {
      try {
        const data = await apiRequest("products/active"); // [{ productCode, name }]
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, [isOpen]);

  const handleChangeStatus = (e) =>
    setFormData((prev) => ({ ...prev, status: e.target.value }));

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index][field] = value;
      return { ...prev, items: newItems };
    });
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { id: null, productCode: "", quantity: 1 }],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      const removed = newItems.splice(index, 1)[0];

      if (removed.id) {
        setDeletedItemIds((prevIds) => [...prevIds, removed.id]);
      }

      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        status: formData.status, // backend expects OrderStatus enum
        items: formData.items.map((item) => ({
          id: item.id || null,
          productCode: item.productCode,
          quantity: Number(item.quantity),
        })),
        deletedItemIds,
      };

      await apiRequest(`orders/${orderId}`, "PUT", payload);

      toast.success("Order updated successfully");
      onOrderUpdated?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              Update Order
            </h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Status */}
              <div>
                <label className="block text-gray-300 mb-1">Order Status</label>
                <select
                  value={formData.status}
                  onChange={handleChangeStatus}
                  required
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="" disabled>Select status</option>
                  {["NEW", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
                    (status) => (
                      <option key={status} value={status}>{status}</option>
                    )
                  )}
                </select>
              </div>

              {/* Items */}
              <div>
                <label className="block text-gray-300 mb-2">Order Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <select
                      value={item.productCode}
                      onChange={(e) => handleItemChange(index, "productCode", e.target.value)}
                      className="bg-gray-800 text-gray-200 p-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                    >
                      <option value="" disabled>Select product</option>
                      {products.map((p) => (
                        <option key={p.productCode} value={p.productCode}>
                          {p.name} ({p.productCode})
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                      className="bg-gray-800 text-gray-200 p-2 rounded-md w-20 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-2 mt-2 text-green-400 hover:text-green-300 font-bold"
                >
                  <FaPlus /> Add Item
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${gradientSubmit} font-bold py-2 px-4 rounded-lg mt-2`}
              >
                {loading ? "Updating..." : "Update Order"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
