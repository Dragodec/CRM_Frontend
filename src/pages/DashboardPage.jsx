import React, { useEffect, useState } from "react";
import { FaUsers, FaTasks, FaUserTie, FaHandshake, FaChartLine, FaBoxOpen, FaShoppingCart, FaClipboardList } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { apiRequest } from "../api";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from "recharts";

const DashboardPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await apiRequest("dashboard/stats");
      setData(res);
    } catch (err) {
      toast.error(err.message || "Failed to fetch dashboard data");
    }
  };

  if (!data) return <div className="text-white p-4">Loading...</div>;

  // Existing stats calculations
  const totalLeads = data.totalLeads || 0;
  const convertedLeads = data.convertedLeads || 0;
  const pendingLeads = totalLeads - convertedLeads;
  const leadConversionPercent = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  const totalTasks = data.totalTasks || 0;
  const completedTasks = data.completedTasks || 0;
  const pendingTasks = totalTasks - completedTasks;

  const totalProducts = data.totalProducts || 0;
  const activeProducts = data.activeProducts || 0;

  const totalOrders = data.totalOrders || 0;
  const activeOrders = data.activeOrders || 0;

  const stats = [
    { title: "Active Users", icon: <FaUsers className="text-4xl text-blue-400" />, value: data.activeUsers || 0, color: "from-blue-700 to-blue-400" },
    { title: "Total Leads", icon: <FaUserTie className="text-4xl text-green-400" />, value: totalLeads, color: "from-green-700 to-green-400" },
    { title: "Total Tasks", icon: <FaTasks className="text-4xl text-yellow-400" />, value: totalTasks, color: "from-yellow-700 to-yellow-400", extra: `Completed: ${completedTasks} | Pending: ${pendingTasks}` },
    { title: "Customers", icon: <FaHandshake className="text-4xl text-pink-400" />, value: data.totalCustomers || 0, color: "from-pink-700 to-pink-400", extra: `Added: ${data.addedCustomers || 0} | Removed: ${data.removedCustomers || 0}` },
    { title: "Lead Conversion", icon: <FaChartLine className="text-4xl text-purple-400" />, value: `${leadConversionPercent}%`, color: "from-purple-700 to-purple-400", progress: leadConversionPercent },
    // New product/order stats
    { title: "Total Products", icon: <FaBoxOpen className="text-4xl text-teal-400" />, value: totalProducts, color: "from-teal-700 to-teal-400", extra: `Active: ${activeProducts}` },
    { title: "Total Orders", icon: <FaShoppingCart className="text-4xl text-orange-400" />, value: totalOrders, color: "from-orange-700 to-orange-400", extra: `Active: ${activeOrders}` },
  ];

  const leadData = [
    { name: "Converted", value: convertedLeads },
    { name: "Pending", value: pendingLeads },
  ];

  const taskData = [
    { name: "Tasks", Completed: completedTasks, Pending: pendingTasks },
  ];

  const customerData = [
    { name: "Current", Added: data.addedCustomers || 0, Removed: data.removedCustomers || 0 },
  ];

  const productData = [
    { name: "Products", Active: activeProducts, Inactive: totalProducts - activeProducts },
  ];

  const orderData = [
    { name: "Orders", Active: activeOrders, Inactive: totalOrders - activeOrders },
  ];

  const COLORS = ["#34D399", "#FBBF24"];

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">CRM Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            className={`bg-gradient-to-r ${stat.color} p-6 rounded-xl shadow-lg flex flex-col justify-between hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex items-center space-x-4">
              {stat.icon}
              <div>
                <h3 className="text-lg font-semibold">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
            {stat.extra && <p className="mt-2 text-sm">{stat.extra}</p>}
            {stat.progress !== undefined && (
              <div className="mt-4 bg-gray-800 h-3 w-full rounded-full">
                <motion.div
                  className="h-3 rounded-full bg-purple-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ duration: 1.5 }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Lead Conversion */}
        <motion.div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl font-bold mb-4">Lead Conversion</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={leadData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} fill="#8884d8" label>
                {leadData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Task Status */}
        <motion.div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl font-bold mb-4">Task Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip cursor={false} contentStyle={{ backgroundColor: "#1F2937", border: "none" }} itemStyle={{ color: "#fff" }} />
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Bar dataKey="Completed" stackId="a" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pending" stackId="a" fill="#EC4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Customer Activity */}
        <motion.div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl font-bold mb-4">Customer Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={customerData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Added" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="Removed" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* New Charts for Products & Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Product Status */}
        <motion.div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl font-bold mb-4">Product Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productData}>
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip cursor={false} contentStyle={{ backgroundColor: "#1F2937", border: "none" }} itemStyle={{ color: "#fff" }} />
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Bar dataKey="Active" fill="#14B8A6" />
              <Bar dataKey="Inactive" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status */}
        <motion.div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl font-bold mb-4">Order Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={orderData} dataKey="Active" nameKey="name" outerRadius={80} label>
                <Cell fill="#14B8A6" />
                <Cell fill="#EF4444" />
              </Pie>
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <motion.div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Recent Leads</h2>
          <ul className="space-y-2">
            {data.recentLeads.map((l) => (
              <li key={l.id} className="bg-gray-700 p-3 rounded flex justify-between items-center hover:bg-gray-600 transition">
                <div>
                  <span className="font-semibold">{l.name}</span> ({l.email})
                </div>
                <span className={`px-2 py-1 text-sm rounded ${l.status === "CONVERTED" ? "bg-green-500 text-gray-900" : "bg-yellow-500 text-gray-900"}`}>
                  {l.status || "New"}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Recent Orders */}
        <motion.div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Recent Orders</h2>
          <ul className="space-y-2">
            {data.recentOrders.map((o) => (
              <li key={o.id} className="bg-gray-700 p-3 rounded flex flex-col hover:bg-gray-600 transition">
                <div className="flex justify-between">
                  <span className="font-semibold">{o.customerName}</span>
                  <span className={`px-2 py-1 text-sm rounded ${o.status === "NEW" ? "bg-yellow-500 text-gray-900" : "bg-green-500 text-gray-900"}`}>
                    {o.status}
                  </span>
                </div>
                <div className="text-sm mt-1">Total: ${o.totalAmount?.toFixed(2)}</div>
                <div className="text-xs mt-1 flex flex-wrap gap-1">
                  {o.items.map((i) => (
                    <span key={i.id} className="px-2 py-1 bg-gray-600 rounded text-xs">{i.productName} x{i.quantity}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
