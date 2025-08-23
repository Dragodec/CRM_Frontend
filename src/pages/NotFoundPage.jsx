import { motion } from "framer-motion";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function NotFound({ fullPage = false }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className={`flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg 
        ${fullPage ? "min-h-screen w-full" : "w-full h-full"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
        transition={{
          type: "tween",
          duration: 0.6,
          ease: "easeInOut",
          delay: 0.2,
        }}
        className="text-blue-400 text-7xl"
      >
        <FaSearch />
      </motion.div>

      {/* Title */}
      <motion.h1
        className="mt-6 text-5xl font-bold text-gray-100 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Page Not Found
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="mt-4 text-gray-400 text-lg text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        Looks like the page you’re looking for has moved or doesn’t exist.
        Let’s get you back on track.
      </motion.p>

      {/* Button */}
      <motion.button
        className="mt-8 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 hover:scale-105 transition-all flex items-center gap-2"
        whileHover={{
          rotate: [0, 3, -3, 0],
          transition: { type: "tween", duration: 0.4, ease: "easeInOut" },
        }}
        onClick={() => navigate("/dashboard")}
      >
        <FaArrowLeft /> Back to Dashboard
      </motion.button>
    </motion.div>
  );
}
