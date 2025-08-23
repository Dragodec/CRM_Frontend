// src/components/TabSwitcher.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaComments, FaTasks, FaShoppingCart } from "react-icons/fa"; // added FaShoppingCart
import InteractionsTab from "../Interaction/InterationsTab";
import TasksTab from "../Tasks/TasksTab";
import OrdersTab from "../Order/OrdersTab"; // import your OrdersTab

export default function TabSwitcher({ customerId }) {
  const [activeTab, setActiveTab] = useState("Interactions");

  const tabs = [
    { name: "Interactions", icon: <FaComments /> },
    { name: "Tasks", icon: <FaTasks /> },
    { name: "Orders", icon: <FaShoppingCart /> }, // added Orders tab
  ];

  return (
    <div className="w-full bg-gray-900 p-4 rounded-2xl shadow-lg flex flex-col gap-6">
      {/* Tab pills */}
      <div className="flex gap-2 justify-center flex-wrap relative">
        {tabs.map((tab) => {
          const isActive = tab.name === activeTab;
          return (
            <motion.button
              key={tab.name}
              className="relative px-6 py-2 rounded-full font-semibold focus:outline-none"
              onClick={() => setActiveTab(tab.name)}
            >
              {/* Background pill */}
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Text + Icon above the pill */}
              <div
                className={`flex items-center gap-2 relative z-10 ${
                  isActive ? "text-white" : "text-gray-300 hover:text-gray-100"
                }`}
              >
                {tab.icon} {tab.name}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="bg-gray-800 p-6 rounded-xl min-h-[150px]">
        {activeTab === "Interactions" ? (
          <InteractionsTab customerId={customerId} />
        ) : activeTab === "Tasks" ? (
          <TasksTab customerId={customerId} />
        ) : (
          <OrdersTab customerId={customerId} /> // render OrdersTab here
        )}
      </div>
    </div>
  );
}
