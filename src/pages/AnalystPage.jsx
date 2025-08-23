import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { FaUsers, FaChartLine, FaShoppingCart, FaTasks } from "react-icons/fa";
import { apiRequest } from "../api";

const PIE_COLORS = ["#3b82f6", "#10b981", "#facc15", "#f97316"];
const LINE_COLORS = ["#22d3ee", "#f43f5e"];
const BAR_COLOR = "#8b5cf6";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="text-white p-6">Something went wrong while rendering charts.</div>;
    return this.props.children;
  }
}

export default function AnalystDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    topProductLimit: 5,
    salesRepId: "",
    leadStatus: "",
    productId: "",
  });

  const fetchDashboard = useCallback(async () => {
    // Validate dates
    if (new Date(filters.startDate) > new Date(filters.endDate)) {
      alert("Start date cannot be after end date");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("startDate", filters.startDate);
      params.append("endDate", filters.endDate);
      params.append("topProductLimit", Number(filters.topProductLimit));

      if (filters.salesRepId && filters.salesRepId !== "") {
        params.append("salesRepId", Number(filters.salesRepId));
      }
      if (filters.productId && filters.productId !== "") {
        params.append("productId", Number(filters.productId));
      }
      if (filters.leadStatus && filters.leadStatus !== "") {
        params.append("leadStatus", filters.leadStatus);
      }

      const queryString = params.toString();
      const data = await apiRequest(`analyst/dashboard?${queryString}`);
      setDashboard(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (!dashboard) return <div className="text-center mt-10 text-white">No data available</div>;

  return (
    <div className="p-6 bg-stone-800 min-h-screen text-white rounded-lg space-y-8 overflow-auto">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block mb-1 text-gray-300">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="border border-gray-600 bg-stone-900 text-white p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="border border-gray-600 bg-stone-900 text-white p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Top Products</label>
          <input
            type="number"
            min={1}
            value={filters.topProductLimit}
            onChange={(e) => setFilters({ ...filters, topProductLimit: e.target.value })}
            className="border border-gray-600 bg-stone-900 text-white p-2 rounded w-20"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Sales Rep ID</label>
          <input
            type="number"
            min={1}
            value={filters.salesRepId}
            onChange={(e) => {
              const val = e.target.value;
              setFilters({ ...filters, salesRepId: val === "" ? "" : val });
            }}
            className="border border-gray-600 bg-stone-900 text-white p-2 rounded w-24"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Product ID</label>
          <input
            type="number"
            min={1}
            value={filters.productId}
            onChange={(e) => {
              const val = e.target.value;
              setFilters({ ...filters, productId: val === "" ? "" : val });
            }}
            className="border border-gray-600 bg-stone-900 text-white p-2 rounded w-24"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Lead Status</label>
          <select
            value={filters.leadStatus}
            onChange={(e) => setFilters({ ...filters, leadStatus: e.target.value })}
            className="border border-gray-600 bg-stone-900 text-white p-2 rounded"
          >
            <option value="">All</option>
            <option value="LEAD_FOLLOW_UP">Follow Up</option>
            <option value="LEAD_NEW">New</option>
            <option value="LEAD_CONVERTED">Converted</option>
            <option value="LEAD_LOST">Lost</option>
          </select>
        </div>
        <button
          onClick={fetchDashboard}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
        >
          Apply
        </button>
      </div>

      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Growth */}
          <motion.div layout className="bg-stone-700 p-6 rounded shadow-lg">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
              <FaUsers /> Customer Growth
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dashboard.customerGrowth || []}>
                <CartesianGrid stroke="#475569" strokeDasharray="4 4" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: 8, borderColor: '#475569' }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={LINE_COLORS[0]}
                  strokeWidth={3}
                  dot={{ r: 4, fill: LINE_COLORS[1] }}
                  activeDot={{ r: 6 }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Orders Revenue */}
          <motion.div layout className="bg-stone-700 p-6 rounded shadow-lg">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
              <FaShoppingCart /> Orders Revenue
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dashboard.orderRevenue || []}>
                <CartesianGrid stroke="#475569" strokeDasharray="4 4" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: 8, borderColor: '#475569' }} />
                <Bar dataKey="revenue" fill={BAR_COLOR} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Lead Status */}
          <motion.div layout className="bg-stone-700 p-6 rounded shadow-lg">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
              <FaChartLine /> Lead Status
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dashboard.leadStatusSummary || []}
                  dataKey="count"
                  nameKey="status"
                  label
                  outerRadius={100}
                  fill={PIE_COLORS[0]}
                  animationDuration={800}
                >
                  {(dashboard.leadStatusSummary || []).map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Products */}
          <motion.div layout className="bg-stone-700 p-6 rounded shadow-lg max-h-[300px] overflow-y-auto">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
              <FaTasks /> Top Products
            </h2>
            <ul className="list-disc pl-6 text-lg space-y-1">
              {(dashboard.topProducts || []).map((p, idx) => (
                <li key={idx}>{p.name} - {p.totalSold}</li>
              ))}
            </ul>
          </motion.div>

          {/* Tasks Summary */}
          <motion.div layout className="bg-stone-700 p-6 rounded shadow-lg max-h-[300px] overflow-y-auto">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
              <FaTasks /> Tasks Summary
            </h2>
            <ul className="list-disc pl-6 text-lg space-y-1">
              <li>Total: {dashboard.tasksSummary?.total || 0}</li>
              <li>Pending: {dashboard.tasksSummary?.pending || 0}</li>
              <li>Completed: {dashboard.tasksSummary?.completed || 0}</li>
              <li>Overdue: {dashboard.tasksSummary?.overdue || 0}</li>
            </ul>
          </motion.div>
        </div>
      </ErrorBoundary>
    </div>
  );
}
