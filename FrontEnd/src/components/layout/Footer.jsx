/**
 * Footer component
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-xl">🏖️</span>
            <span>© {currentYear} Beach Tennis. All rights reserved.</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-700 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-700 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;