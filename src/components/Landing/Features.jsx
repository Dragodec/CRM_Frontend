import { FaUsers, FaTasks, FaComments } from 'react-icons/fa';
import { SiGoogleanalytics } from "react-icons/si";
import { MdEmail, MdShoppingCart } from "react-icons/md";
import { motion } from "framer-motion";
import { BsKanban } from "react-icons/bs";

const features = [
  {
    icon: <FaUsers />,
    title: 'Understand Every Customer',
    desc: 'See all customer activities, past interactions, and preferences in one place to build stronger relationships.',
    color: 'red-500'
  },
  {
    icon: <BsKanban />,
    title: 'Streamline Sales & Tasks',
    desc: 'Visualize your sales pipeline and manage tasks easily with drag-and-drop Kanban boards.',
    color: 'blue-500'
  },
  {
    icon: <SiGoogleanalytics />,
    title: 'Make Data-Driven Decisions',
    desc: 'Instantly access key metrics from sales and interactions to uncover growth opportunities.',
    color: 'green-500'
  },
  {
    icon: <FaComments />,
    title: 'Communicate Without Switching Apps',
    desc: 'Secure, integrated messaging so your team and customers can connect instantly.',
    color: 'yellow-500'
  },
  {
    icon: <MdEmail />,
    title: 'Stay on Top of Every Detail',
    desc: 'Automated reminders and email alerts ensure you never miss a follow-up or deadline.',
    color: 'purple-500'
  },
  {
    icon: <MdShoppingCart />,
    title: 'Manage Products, Orders & Leads',
    desc: 'All your sales, orders, and lead management in one connected CRM system.',
    color: 'pink-500'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" }
  })
};

const Features = () => {
  return (
    <section id="features" className="w-full px-6 py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-extrabold text-gray-800">Powerful CRM Features</h2>
        <p className="text-gray-600 mt-3 text-lg">
          Tools designed to simplify your workflow, grow sales, and keep customers happy.
        </p>
      </div>

      {/* Grid layout for desktop and stacked layout for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center border-t-4"
            style={{ borderTopColor: `var(--tw-color-${f.color})` }}
          >
            <div className={`text-5xl text-${f.color} mb-4`}>{f.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
