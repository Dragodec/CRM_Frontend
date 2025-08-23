import Navbar from "../components/Landing/Navbar";
import Features from "../components/Landing/Features";
import HowItWorks from "../components/Landing/HowItWorks";
import PricingPlans from "../components/Landing/PricingPlans";
import Footer from "../components/Landing/Footer";
import { motion } from "framer-motion";

const Hero = () => (
  <section className="w-full bg-gradient-to-r from-pink-50 to-purple-50 py-20 px-6 text-center">
    <div className="max-w-4xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-gray-800 leading-tight"
      >
        Manage, Automate & <span className="text-pink-500">Skyrocket</span> Your E-Commerce Sales
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg text-gray-600 mt-6"
      >
        Engage X gives you all the tools to track customers, close more deals, and grow your store like never before.
      </motion.p>
      <motion.a
        href="#pricing"
        className="inline-block mt-8 px-8 py-4 bg-pink-500 text-white rounded-lg font-medium shadow-lg hover:bg-pink-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Get Started Now
      </motion.a>
    </div>
  </section>
);

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <PricingPlans />
      <Footer />
    </div>
  );
};

export default LandingPage;
