
import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';
import heroImg from '../assets/hero-dashboard.jpg';

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.section
      className="flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-10 px-4 md:px-12 py-12 bg-gradient-to-br from-purple-50 to-pink-50 relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Mobile Layout */}
      <motion.div className="md:hidden w-full" variants={itemVariants}>
        <FaRocket className="mx-auto text-5xl text-pink-500 mb-4 animate-bounce" />
        <h1 className="text-3xl font-extrabold mb-3 text-purple-700 leading-relaxed">
          Turn Every Lead <br /> into a Loyal Customer
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Engage X helps you manage relationships, boost sales, and keep customers coming back — all in one intuitive CRM.
        </p>
        <div className="flex flex-col gap-3">
          <motion.a
            href="#features"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow hover:bg-purple-700 transition"
            variants={itemVariants}
          >
            Start Free Trial
          </motion.a>
          <motion.a
            href="#demo"
            className="border border-purple-700 text-purple-700 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 hover:text-white shadow transition"
            variants={itemVariants}
          >
            Book a Demo
          </motion.a>
        </div>
        <motion.img
          src={heroImg}
          alt="Engage X Dashboard"
          className="mt-8 w-full rounded-xl shadow-lg"
          variants={itemVariants}
        />
        <p className="mt-4 text-gray-500 text-sm">
          Trusted by 1,200+ growing businesses worldwide
        </p>
      </motion.div>

      {/* Larger Screen Layout */}
      <motion.div className="hidden md:flex w-full max-w-6xl items-center justify-between" variants={itemVariants}>
        {/* Left Text */}
        <div className="max-w-lg space-y-6">
          <motion.h1
            className="text-5xl font-extrabold text-purple-700 leading-tight"
            variants={itemVariants}
          >
            Turn Every Lead into a Loyal Customer
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 leading-relaxed"
            variants={itemVariants}
          >
            Manage leads, nurture relationships, and close deals faster — all with powerful automation and real-time insights.
          </motion.p>
          <motion.div className="flex gap-4" variants={itemVariants}>
            <a
              href="#features"
              className="bg-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-purple-700 transition"
            >
              Start Free Trial
            </a>
            <a
              href="#demo"
              className="border border-purple-700 text-purple-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 hover:text-white shadow-lg transition"
            >
              Book a Demo
            </a>
          </motion.div>
          <p className="text-sm text-gray-500 pt-2">
            ⭐ Rated 4.9/5 from over 500 reviews
          </p>
        </div>

        {/* Right Visual */}
        <motion.div className="max-w-xl" variants={itemVariants}>
          <img
            src={heroImg}
            alt="CRM Dashboard preview"
            className="w-full rounded-xl shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
