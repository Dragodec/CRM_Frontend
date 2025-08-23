// src/components/Product/UpdateProductModal.jsx
import React, { useState, useEffect } from "react";
import { apiRequest } from "../../api";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

const gradientSave =
  "bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white";
const gradientCancel = "bg-gray-600 hover:bg-gray-700 text-white";

export default function UpdateProductModal({ isOpen, onClose, product, onProductUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price !== undefined ? product.price : "",
        stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity : "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert price and stockQuantity to numbers
    if (name === "price") {
      setFormData((prev) => ({ ...prev, [name]: value === "" ? "" : parseFloat(value) }));
    } else if (name === "stockQuantity") {
      setFormData((prev) => ({ ...prev, [name]: value === "" ? "" : parseInt(value, 10) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product?.id) {
      toast.error("Product ID is missing.");
      return;
    }

    setLoading(true);
    try {
      await apiRequest(`products/${product.id}`, "PUT", formData);
      toast.success("Product updated successfully!");
      onProductUpdated();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-purple-400">Update Product</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-200 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200"
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${gradientCancel}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg ${gradientSave}`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
