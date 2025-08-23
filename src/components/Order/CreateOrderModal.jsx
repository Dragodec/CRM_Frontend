import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { apiRequest } from "../../api";
import { toast } from "react-toastify";

const gradientSubmit =
  "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white";
const gradientRemove =
  "bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white";

export default function CreateOrderModal({ isOpen, onClose, onOrderCreated }) {
  const [formData, setFormData] = useState({
    customerEmail: "",
    createdByUsername: "",
    items: [{ productCode: "", quantity: 1 }],
  });
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch dropdown data
  useEffect(() => {
    if (!isOpen) return;

    const fetchDropdowns = async () => {
      try {
        const [custData, userData, productData] = await Promise.all([
          apiRequest("customers/active-emails"),
          apiRequest("users/active-emails"),
          apiRequest("products/active"),
        ]);
        setCustomers(custData);
        setUsers(userData);
        setProducts(productData);
        setFormData({
          customerEmail: custData[0] || "",
          createdByUsername: userData[0] || "",
          items: [{ productCode: productData[0]?.productCode || "", quantity: 1 }],
        });
      } catch (err) {
        console.error("Failed to fetch dropdowns", err);
      }
    };

    fetchDropdowns();
  }, [isOpen]);

  const handleItemChange = (index, key, value) => {
    const updatedItems = [...formData.items];
    if (key === "quantity") {
      updatedItems[index][key] = parseInt(value) || 1;
    } else {
      updatedItems[index][key] = value;
    }
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productCode: products[0]?.productCode || "", quantity: 1 }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("orders", "POST", formData, { "Content-Type": "application/json" });
      toast.success("Order created successfully!");
      onOrderCreated?.();
      onClose();
      setFormData({ customerEmail: "", createdByUsername: "", items: [{ productCode: "", quantity: 1 }] });
    } catch (err) {
      toast.error("Failed to create order");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total
  const totalAmount = formData.items.reduce((sum, item) => {
    const product = products.find((p) => p.productCode === item.productCode);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

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
            className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[85vh]"
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

            <h2 className="text-2xl font-bold text-purple-400 mb-4">Create New Order</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Customer */}
              <div>
                <label className="block text-gray-300 mb-1">Customer Email</label>
                <select
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {customers.map((email) => (
                    <option key={email} value={email}>{email}</option>
                  ))}
                </select>
              </div>

              {/* Created By */}
              <div>
                <label className="block text-gray-300 mb-1">Created By</label>
                <select
                  name="createdByUsername"
                  value={formData.createdByUsername}
                  onChange={(e) => setFormData({ ...formData, createdByUsername: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {users.map((email) => (
                    <option key={email} value={email}>{email}</option>
                  ))}
                </select>
              </div>

              {/* Items */}
              <div>
                <label className="block text-gray-300 mb-2">Order Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2 items-start sm:items-center">
                    <select
                      value={item.productCode}
                      onChange={(e) => handleItemChange(index, "productCode", e.target.value)}
                      required
                      className="flex-1 bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      {products.map((p) => (
                        <option key={p.productCode} value={p.productCode}>
                          {p.name} ({p.productCode}) - ${p.price.toFixed(2)}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      required
                      className="w-24 bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />

                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className={`px-2 py-1 rounded-md ${gradientRemove}`}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="px-2 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white mt-1 text-sm flex items-center gap-1"
                >
                  <FaPlus /> Add Item
                </button>
              </div>

              {/* Total */}
              <div className="text-right text-gray-200 font-bold mt-2">
                Total: ${totalAmount.toFixed(2)}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${gradientSubmit} font-bold py-2 px-4 rounded-lg mt-2`}
              >
                {loading ? "Creating..." : "Create Order"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
