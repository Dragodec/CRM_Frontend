import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Brand Section */}
        <div>
          <a href="/" className="text-2xl font-bold text-purple-700">Engage X</a>
          <p className="mt-2 text-gray-500 text-sm">
            Powerful CRM tools to manage leads, close deals, and grow your business effortlessly.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#features" className="hover:text-pink-500">Features</a></li>
            <li><a href="#pricing" className="hover:text-pink-500">Pricing</a></li>
            <li><a href="#how" className="hover:text-pink-500">How It Works</a></li>
            <li><a href="/login" className="hover:text-pink-500">Login</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Connect</h4>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="https://twitter.com" aria-label="Twitter" className="text-gray-500 hover:text-pink-500">
              <FaTwitter size={18} />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-500 hover:text-pink-500">
              <FaLinkedin size={18} />
            </a>
            <a href="https://github.com" aria-label="GitHub" className="text-gray-500 hover:text-pink-500">
              <FaGithub size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {currentYear} Engage X. All Rights Reserved. | 
        <a href="/terms" className="hover:text-pink-500 ml-1">Terms</a> | 
        <a href="/privacy" className="hover:text-pink-500 ml-1">Privacy</a>
      </div>
    </footer>
  );
};

export default Footer;
