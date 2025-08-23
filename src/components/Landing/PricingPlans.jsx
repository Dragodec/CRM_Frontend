import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

// Rough USD → INR conversion: 1 USD = 83 INR
// Price reduction: ~30%
const plans = [
  {
    name: "Free",
    price: 0,
    period: "/month",
    description:
      "For experimenters and small sellers to explore Engage X with no risk.",
    features: [
      "Up to 100 customer records",
      "Basic Interaction Monitoring",
      "Simple Kanban Task Board",
      "Email Support",
    ],
    cta: "Start Free",
    color: "green-500",
    highlight: false,
  },
  {
    name: "Starter",
    price: Math.round(29 * 83 * 0.7), // ~1683 INR
    period: "/month",
    description:
      "Perfect for small e-commerce stores starting to manage sales and customers.",
    features: [
      "Unlimited Customer & Interaction Monitoring",
      "Sales Pipeline & Kanban Tasks",
      "In-built Messaging",
      "Manage Products & Orders",
    ],
    cta: "Start Free Trial",
    color: "purple-500",
    highlight: false,
  },
  {
    name: "Pro",
    price: Math.round(59 * 83 * 0.7), // ~3427 INR
    period: "/month",
    description:
      "For growing businesses that want full automation, insights, and scalability.",
    features: [
      "Everything in Starter",
      "Automated Reminders & Emails",
      "Data-Driven Analytics",
      "Advanced Reporting & Insights",
    ],
    cta: "Get Started",
    color: "pink-500",
    highlight: true,
  },
];

const colorClasses = {
  "green-500": {
    bg: "bg-green-500",
    text: "text-green-500",
    border: "border-green-500",
  },
  "purple-500": {
    bg: "bg-purple-500",
    text: "text-purple-500",
    border: "border-purple-500",
  },
  "pink-500": {
    bg: "bg-pink-500",
    text: "text-pink-500",
    border: "border-pink-500",
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const PricingPlans = () => {
  return (
    <section id="pricing" className="w-full bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-gray-600 mt-3 max-w-3xl mx-auto">
          Choose the plan that fits your business. No hidden fees. Cancel
          anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => {
          const colors = colorClasses[plan.color] || {};
          return (
            <motion.div
              key={plan.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className={`relative bg-white p-8 rounded-xl shadow-md border-t-4 ${colors.border}`}
            >
              {plan.highlight && (
                <span
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-sm font-semibold text-white ${colors.bg} rounded-full shadow-md`}
                >
                  Most Popular
                </span>
              )}

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-800">
                  ₹{plan.price}
                </span>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <FaCheck className={colors.text} />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.a
                href="#"
                className={`block w-full text-center py-3 rounded-lg font-medium text-white ${colors.bg} shadow-md transition-colors duration-300 hover:opacity-90`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {plan.cta}
              </motion.a>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default PricingPlans;
