import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    content: "Their honeypot solution has been instrumental in helping us understand and prevent advanced persistent threats. The intelligence we've gathered has strengthened our security posture significantly.",
    author: "Sarah Chen",
    position: "CISO at TechCorp",
    avatar: "https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: 5
  },
  {
    content: "The threat intelligence reports we receive are incredibly detailed and actionable. We've been able to proactively block several potential attacks thanks to the early warning system.",
    author: "Michael Rodriguez",
    position: "Security Operations Manager",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: 5
  },
  {
    content: "Setting up the honeypot network was seamless, and the insights we've gained about attacker behaviors have been invaluable. Their support team is highly knowledgeable in cybersecurity.",
    author: "Alex Thompson",
    position: "IT Security Director",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it. See what our customers have to say about our hosting services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-white font-medium">{testimonial.author}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;