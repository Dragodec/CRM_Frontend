import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogIn, FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm"
      role="navigation"
      aria-label="Main Navigation"
    >
      {/* Mobile Layout */}
      <div className="flex md:hidden items-center justify-between px-4 py-3">
        <a href="/" className="text-2xl font-bold text-purple-700">Engage X</a>
        <div className="flex items-center gap-3">
          <motion.a
            href="/login"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow transition font-medium"
            whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(236,72,153,0.4)" }}
            whileTap={{ scale: 0.97 }}
          >
            <FiLogIn size={18} />
            Login
          </motion.a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 p-2"
            aria-label="Toggle Menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-gray-200 px-4 py-3"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-2 text-gray-700 font-medium hover:text-pink-500"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between px-12 py-4">
        <a href="/" className="text-2xl font-bold text-purple-700">Engage X</a>
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="relative font-medium text-gray-700"
              whileHover="hover"
            >
              <span>{link.label}</span>
              <motion.span
                className="absolute left-0 bottom-0 h-[2px] bg-pink-500"
                initial={{ width: 0 }}
                variants={{ hover: { width: "100%", transition: { duration: 0.3 } } }}
              />
            </motion.a>
          ))}
          <motion.a
            href="/login"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium shadow-md"
            whileHover={{ scale: 1.05, boxShadow: "0 6px 25px rgba(236,72,153,0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            <FiLogIn size={20} />
            Login
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
