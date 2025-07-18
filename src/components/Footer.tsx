import React from 'react';
import { Server, Bot, MessageCircle, Mail, Shield, Globe, AlertTriangle, FileText } from 'lucide-react';
import { Link } from './Link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-16 border-b border-gray-800">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-indigo-500" />
              <span className="ml-2 text-xl font-bold text-white">EliteHosting</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Advanced threat intelligence through honeypot technology.
              Protecting organizations with proactive cyber defense.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Our Solutions</h4>
            <ul className="space-y-4">
              <li>
                <Link to="#honeypot-network" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Server className="w-4 h-4 mr-2" />
                  Honeypot Network
                </Link>
              </li>
              <li>
                <Link to="#threat-analysis" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Threat Analysis
                </Link>
              </li>
              <li>
                <Link to="#intelligence-reports" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Intelligence Reports
                </Link>
              </li>
              <li>
                <Link to="#pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Threat Intelligence Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Research Papers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Threat Dashboard
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-indigo-400 mr-3 mt-1" />
                <span className="text-gray-400">security@EliteHosting.io</span>
              </li>
              <li className="flex items-start">
                <Globe className="w-5 h-5 text-indigo-400 mr-3 mt-1" />
                <span className="text-gray-400">Global Security Operations</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="py-8 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} EliteHosting. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;