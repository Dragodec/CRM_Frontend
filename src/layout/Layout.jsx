import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden pt-10">
      <Sidebar />
      <div className="flex-1 overflow-y-auto ml-0 md:ml-64 transition-all duration-300">
        <div className="p-6 w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
