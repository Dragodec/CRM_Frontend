import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "../../api";
import { toast } from "react-toastify";
import UpdateProductModal from "./UpdateProductModal"; // ✅ import update modal

const gradientClose =
  "bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white";
const gradientEdit =
  "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white";
const gradientDelete =
  "bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white";
const modalBackdrop =
  "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";
const modalContainer =
  "bg-gray-900 p-6 rounded-2xl shadow-xl max-w-2xl w-full relative";

const ViewProductModal = ({ isOpen, id, onClose, onProductUpdated }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // ✅ track edit modal

  useEffect(() => {
    if (!id || !isOpen) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(`products/${id}`, "GET");
        setProduct(data);
      } catch (err) {
        toast.error("Failed to load product");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isOpen, onClose]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);
    try {
      await apiRequest(`products/${id}`, "DELETE");
      toast.success("Product deleted successfully");
      onProductUpdated?.();
      onClose();
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const handleProductUpdated = () => {
    onProductUpdated?.(); // refresh parent list
    setShowEditModal(false); // close update modal
    onClose(); // close view modal as well
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className={modalContainer}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-100 text-xl font-bold"
              >
                &times;
              </button>
              {loading ? (
                <p className="text-gray-400 text-center">Loading...</p>
              ) : product ? (
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl font-bold text-gray-100 text-center">
                    Product Details
                  </h2>
                  {/* Product Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 font-semibold">Product Code</p>
                      <p className="text-gray-100">{product.productCode}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">Name</p>
                      <p className="text-gray-100">{product.name}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-400 font-semibold">Description</p>
                      <p className="text-gray-100">{product.description}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">Price</p>
                      <p className="text-gray-100">${product.price?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">Stock Quantity</p>
                      <p className="text-gray-100">{product.stockQuantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">Active</p>
                      <p
                        className={`${
                          product.active ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {product.active ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">Created At</p>
                      <p className="text-gray-100">
                        {new Date(product.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">Updated At</p>
                      <p className="text-gray-100">
                        {new Date(product.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className={`px-4 py-2 rounded-lg ${gradientEdit}`}
                      onClick={() => setShowEditModal(true)} // ✅ open update modal
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
                <p className="text-gray-400 text-center">Product not found.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ UpdateProductModal rendered here */}
      {showEditModal && (
        <UpdateProductModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          product={product}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </>
  );
};

export default ViewProductModal;
