import { useState } from "react";
import { motion } from "framer-motion";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateFields = () => {
    let newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  const validationErrors = validateFields();
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;

  setLoading(true);

  try {
    const data = await apiRequest("auth/login", "POST", { email, password });

    localStorage.setItem("email", data.email);
    localStorage.setItem("role", data.role);

    toast.success("Login successful!", { position: "top-right", autoClose: 1500 });

    setTimeout(() => navigate("/dashboard"), 1500);
  } catch (err) {
    toast.error(err.message || "Login failed", { position: "top-right", autoClose: 3000 });
  } finally {
    setLoading(false);
  }
};

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
      <ToastContainer />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8"
      >

        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#e60076] to-[#ad46ff] leading-snug">
            Welcome Back to Engage X
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6 leading-relaxed">
            Let’s get you back to connecting and growing 🚀
          </p>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
     
          <motion.div variants={itemVariants}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div
              className={`flex items-center border rounded-lg px-4 py-3 bg-purple-50 ${
                errors.email ? "border-red-500" : "border-transparent"
              }`}
            >
              <FaEnvelope className="text-purple-500 mr-2" />
              <input
                id="email"
                type="email"
                aria-label="Email"
                autoComplete="off"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 leading-relaxed"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div
              className={`flex items-center border rounded-lg px-4 py-3 bg-purple-50 ${
                errors.password ? "border-red-500" : "border-transparent"
              }`}
            >
              <FaLock className="text-purple-500 mr-2" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                aria-label="Password"
                autoComplete="off"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 leading-relaxed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none text-purple-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            <div className="text-right mt-1">
              <a
                href="/forgot-password"
                className="text-sm text-purple-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg shadow text-white transition bg-gradient-to-r from-[#e60076] to-[#ad46ff] ${
                loading ? "opacity-75" : "hover:opacity-90"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
