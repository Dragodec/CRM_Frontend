import React, { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../api";
import { toast } from "react-toastify";
import { FaEye, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import CreateProductModal from "../components/Product/CreateProductModal";
import ViewProductModal from "../components/Product/ViewProductModal"; // new modal
const gradientView =
  "bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white";
const gradientCreate =
  "bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white";
export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append("page", page);
      query.append("size", 10);
      if (search) query.append("search", search);
      if (activeFilter) query.append("active", activeFilter);
      const data = await apiRequest(`products?${query.toString()}`);
      setProducts(data.content);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [page, search, activeFilter]);
  useEffect(() => setPage(0), [search, activeFilter]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };
  const handleProductCreated = () => {
    fetchProducts(); // refresh after creation
  };
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedProduct(null);
  };
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      {/* Header + Filters */}
      <div className="flex flex-col mb-6 gap-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full">
          <input
            type="text"
            placeholder="Search by product code or name"
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-900 w-full sm:w-auto flex-grow min-w-[150px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-900 w-full sm:w-auto flex-grow min-w-[120px]"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg w-full sm:w-auto ${gradientCreate}`}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <FaPlus /> Create Product
          </button>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <AnimatePresence>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-200">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Product Code</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock Quantity</th>
                  <th className="p-3">Active</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-3 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-3 text-center">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                      <td className="p-3">{product.id}</td>
                      <td className="p-3">{product.productCode}</td>
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">${product.price?.toFixed(2)}</td>
                      <td className="p-3">{product.stockQuantity}</td>
                      <td className="p-3">{product.active ? "Yes" : "No"}</td>
                      <td className="p-3">
                        <button
                          className={`px-3 py-2 rounded ${gradientView} flex items-center gap-1`}
                          onClick={() => handleViewProduct(product)}
                        >
                          <FaEye /> View
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AnimatePresence>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center">No products found</p>
        ) : (
          products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-2"
            >
              <p>
                <strong>ID:</strong> {product.id}
              </p>
              <p>
                <strong>Product Code:</strong> {product.productCode}
              </p>
              <p>
                <strong>Name:</strong> {product.name}
              </p>
              <p>
                <strong>Price:</strong> ${product.price?.toFixed(2)}
              </p>
              <p>
                <strong>Stock:</strong> {product.stockQuantity}
              </p>
              <p>
                <strong>Active:</strong> {product.active ? "Yes" : "No"}
              </p>
              <div className="flex mt-2 justify-end">
                <button
                  className={`px-3 py-2 rounded ${gradientView} flex items-center gap-1`}
                  onClick={() => handleViewProduct(product)}
                >
                  <FaEye /> View
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      {/* Modals */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProductCreated={handleProductCreated}
      />
      <ViewProductModal
        isOpen={isViewModalOpen}
        id={selectedProduct?.id}
        onClose={handleCloseViewModal}
        onProductUpdated={fetchProducts}
      />
    </div>
  );
}