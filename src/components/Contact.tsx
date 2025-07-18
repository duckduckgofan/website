import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to an API
    console.log('Form submitted:', formState);
    
    // Simulate successful submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormState({
        name: '',
        email: '',
        service: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Started with Threat Intelligence</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to enhance your security posture? Contact us to discuss how our honeypot solutions can protect your organization.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Thanks for reaching out!</h3>
                <p className="text-gray-300 mb-6">
                  We've received your message and will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors duration-200"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-gray-300 font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-gray-300 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="service" className="block text-gray-300 font-medium">
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formState.service}
                    onChange={handleChange}
                    required
                    className="w-full py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white appearance-none"
                  >
                    <option value="">Select a service</option>
                    <option value="honeypot">Enterprise Honeypot Network</option>
                    <option value="threat-intel">Threat Intelligence Platform</option>
                    <option value="managed">Managed Security Services</option>
                    <option value="consulting">Security Consulting</option>
                  </select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="message" className="block text-gray-300 font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none"
                    placeholder="Tell us about your project and your specific needs..."
                  ></textarea>
                </div>
                
                <div className="md:col-span-2 text-center">
                  <button
                    type="submit"
                    className="inline-flex items-center px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors duration-200 group"
                  >
                    Send Message
                    <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;