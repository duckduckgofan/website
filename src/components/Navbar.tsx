import React, { useState, useEffect } from 'react';
import { Menu, X, Server, AlertTriangle, FileText, Shield, ChevronDown } from 'lucide-react';
import { Link } from './Link';

interface NavbarProps {
  onThreatAnalysisClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onThreatAnalysisClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <Shield className="h-8 w-8 text-indigo-500" />
                <span className="ml-2 text-xl font-bold text-white">EliteHosting</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="#honeypot-network"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Server className="w-4 h-4 mr-1" />
                  Honeypot Network
                </Link>
                <button
                  onClick={onThreatAnalysisClick}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Threat Analysis
                </button>
                <Link
                  to="#intelligence-reports"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Intelligence Reports
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    Resources
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  {isResourcesOpen && (
                    <div className="absolute top-full left-0 w-48 py-2 mt-1 bg-gray-800 rounded-md shadow-lg">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Threat Intelligence Blog
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Research Papers
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Threat Dashboard
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Link
                to="#contact"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-label="Main menu"
              aria-expanded="false"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="#honeypot-network"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <Server className="w-4 h-4 mr-2" />
              Honeypot Network
            </Link>
            <button
              onClick={() => {
                onThreatAnalysisClick();
                setIsOpen(false);
              }}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Threat Analysis
            </button>
            <Link
              to="#intelligence-reports"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Intelligence Reports
            </Link>
            <div className="border-t border-gray-700 my-2"></div>
            <a
              href="#"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Threat Intelligence Blog
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Research Papers
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Threat Dashboard
            </a>
            <div className="border-t border-gray-700 my-2"></div>
            <Link
              to="#contact"
              className="bg-indigo-600 hover:bg-indigo-700 text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;