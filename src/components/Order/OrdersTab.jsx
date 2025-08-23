import React, { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../../api";
import { toast } from "react-toastify";
import { FaEye, FaPlus } from "react-icons/fa";
import ViewOrderModal from "./ViewOrderModal";
import CreateOrderModal from "./CreateOrderModal";

const gradientView =
  "bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white";
const gradientCreate =
  "bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white";

const OrdersTab = ({ customerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await apiRequest(`orders/customer/${customerId}`, "GET");
      // Optionally calculate totalAmount if backend does not send it
      const enriched = data.map((order) => ({
        ...order,
        totalAmount: order.items?.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        ),
      }));
      setOrders(enriched);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="relative p-4">
      {/* Create button */}
      <div className="flex justify-end mb-4">
        <button
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${gradientCreate}`}
          onClick={() => setIsCreateOpen(true)}
        >
          <FaPlus /> Create Order
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400 text-center">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-md hover:bg-gray-800 transition-colors flex flex-col justify-between"
            >
              <div className="mb-4">
                <p className="text-gray-300 font-semibold">
                  Status: <span className="text-gray-100">{order.status}</span>
                </p>
                <p className="text-gray-300 font-semibold">
                  Total Items: <span className="text-gray-100">{order.items?.length || 0}</span>
                </p>
                <p className="text-gray-300 font-semibold">
                  Total Amount: <span className="text-gray-100">${order.totalAmount.toFixed(2)}</span>
                </p>
              </div>
              <button
                className={`mt-auto px-3 py-1 rounded-lg flex items-center justify-center gap-2 ${gradientView}`}
                onClick={() => setSelectedOrderId(order.id)}
              >
                <FaEye /> View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* View Order Modal */}
      {selectedOrderId && (
        <ViewOrderModal
          id={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}

      {/* Create Order Modal */}
      {isCreateOpen && (
        <CreateOrderModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          customerId={customerId}
          onOrderCreated={fetchOrders}
        />
      )}
    </div>
  );
};

export default OrdersTab;
