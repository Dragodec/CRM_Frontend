import { motion } from "framer-motion";
import { FaRocket, FaCogs, FaChartLine } from "react-icons/fa";

const steps = [
  {
    icon: <FaRocket />,
    title: "Capture & Organize Every Opportunity",
    desc: "No lead slips through the cracks. Track every customer, every order, and every interaction from day one — all in one powerful dashboard.",
    color: "pink-500"
  },
  {
    icon: <FaCogs />,
    title: "Automate & Streamline Your Sales Process",
    desc: "From automated reminders to in-built messaging and Kanban task boards, our CRM removes bottlenecks so you can focus on closing deals, not chasing them.",
    color: "purple-500"
  },
  {
    icon: <FaChartLine />,
    title: "Analyze, Optimize & Skyrocket Growth",
    desc: "Leverage real-time analytics to see exactly what’s working. Make smart, data-driven decisions that turn your e-commerce business into an unstoppable sales machine.",
    color: "green-500"
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" }
  })
};

const HowItWorks = () => {
  return (
    <section id="how" className="w-full bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-extrabold text-gray-800">
          How Engage X Helps You Win
        </h2>
        <p className="text-lg text-gray-600 mt-3 max-w-3xl mx-auto">
          Engage X is more than a CRM — it’s your growth partner. From the first customer touch to repeat purchases, 
          we give you the tools to sell smarter, serve better, and scale faster. Here’s how:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="bg-white p-8 rounded-xl shadow-md text-center border-t-4"
            style={{ borderTopColor: `var(--tw-color-${step.color})` }}
          >
            <div className={`text-5xl text-${step.color} mb-4`}>{step.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
