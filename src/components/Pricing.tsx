import React, { useState } from 'react';
import { Check, Server, Bot, MessageCircle } from 'lucide-react';
import { Link } from './Link';

type PricingCategory = 'game' | 'discord' | 'telegram';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  cta: string;
  highlighted?: boolean;
}

const Pricing: React.FC = () => {
  const [category, setCategory] = useState<PricingCategory>('game');

  const gameHostingPlans: PricingPlan[] = [
    {
      name: 'Starter',
      price: 5,
      description: 'Perfect for small gaming communities',
      features: [
        { text: '2GB RAM', included: true },
        { text: '10GB SSD Storage', included: true },
        { text: 'Single Game Server', included: true },
        { text: '24/7 Uptime', included: true },
        { text: 'Basic DDoS Protection', included: true },
        { text: 'Control Panel Access', included: true },
        { text: 'Automated Backups', included: false },
        { text: 'Premium Support', included: false }
      ],
      cta: 'Get Started'
    },
    {
      name: 'Premium',
      price: 15,
      description: 'Most popular for mid-sized communities',
      features: [
        { text: '8GB RAM', included: true },
        { text: '30GB SSD Storage', included: true },
        { text: 'Up to 3 Game Servers', included: true },
        { text: '24/7 Uptime', included: true },
        { text: 'Advanced DDoS Protection', included: true },
        { text: 'Control Panel Access', included: true },
        { text: 'Daily Automated Backups', included: true },
        { text: 'Priority Support', included: true }
      ],
      cta: 'Choose Premium',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 45,
      description: 'Best for large gaming communities',
      features: [
        { text: '16GB RAM', included: true },
        { text: '100GB SSD Storage', included: true },
        { text: 'Unlimited Game Servers', included: true },
        { text: '24/7 Uptime', included: true },
        { text: 'Enterprise DDoS Protection', included: true },
        { text: 'Advanced Control Panel Access', included: true },
        { text: 'Hourly Automated Backups', included: true },
        { text: 'Dedicated Support', included: true }
      ],
      cta: 'Contact Sales'
    }
  ];

  const discordBotPlans: PricingPlan[] = [
    {
      name: 'Basic Bot',
      price: 4,
      description: 'For simple Discord bots',
      features: [
        { text: '1GB RAM', included: true },
        { text: '10GB Storage', included: true },
        { text: '24/7 Uptime', included: true },
        { text: 'Node.js Environment', included: true },
        { text: 'Basic Monitoring', included: true },
        { text: 'Basic Support', included: true },
        { text: 'Automated Restarts', included: false },
        { text: 'Performance Metrics', included: false }
      ],
      cta: 'Get Started'
    },
    {
      name: 'Standard Bot',
      price: 12,
      description: 'For mid-sized Discord bots',
      features: [
        { text: '4GB RAM', included: true },
        { text: '25GB Storage', included: true },
        { text: '24/7 Uptime', included: true },
        { text: 'Node.js Environment', included: true },
        { text: 'Advanced Monitoring', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Automated Restarts', included: true },
        { text: 'Performance Metrics', included: true }
      ],
      cta: 'Choose Standard',
      highlighted: true
    },
    {
      name: 'Premium Bot',
      price: 30,
      description: 'For large-scale Discord bots',
      features: [
        { text: '10GB RAM', included: true },
        { text: '50GB Storage', included: true },
        { text: '24/7 Uptime', included: true },
        { text: 'Custom Environment', included: true },
        { text: 'Enterprise Monitoring', included: true },
        { text: 'Dedicated Support', included: true },
        { text: 'Automated Scaling', included: true },
        { text: 'Advanced Analytics', included: true }
      ],
      cta: 'Contact Sales'
    }
  ];

  const telegramBotPlans: PricingPlan[] = [
    {
      name: 'Basic',
      price: 3,
      description: 'For personal Telegram bots',
      features: [
        { text: '1GB RAM', included: true },
        { text: '5GB Storage', included: true },
        { text: '24/7 Uptime', included: true },
        { text: 'Python Environment', included: true },
        { text: 'Basic Monitoring', included: true },
        { text: 'Email Support', included: true },
        { text: 'Automated Backups', included: false },
        { text: 'Analytics Dashboard', included: false }
      ],
      cta: 'Get Started'
    },
    {
      name: 'Pro',
      price: 10,
      description: 'For business Telegram bots',
      features: [
        { text: '3GB RAM', included: true },
        { text: '20GB Storage', included: true },
        { text: '24/7 Uptime', included: true },
        { text: 'Python/Node.js Environment', included: true },
        { text: 'Advanced Monitoring', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Daily Automated Backups', included: true },
        { text: 'Analytics Dashboard', included: true }
      ],
      cta: 'Choose Pro',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 25,
      description: 'For high-traffic Telegram bots',
      features: [
        { text: '8GB RAM', included: true },
        { text: '40GB Storage', included: true },
        { text: '24/7 Uptime', included: true },
        { text: 'Custom Environment', included: true },
        { text: 'Enterprise Monitoring', included: true },
        { text: 'Dedicated Support', included: true },
        { text: 'Hourly Automated Backups', included: true },
        { text: 'Advanced Analytics', included: true }
      ],
      cta: 'Contact Sales'
    }
  ];

  const plans = {
    game: gameHostingPlans,
    discord: discordBotPlans,
    telegram: telegramBotPlans
  };

  const selectedPlans = plans[category];

  return (
    <section id="pricing" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Transparent Pricing</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include 24/7 uptime and our technical support.
          </p>
          
          <div className="flex flex-wrap justify-center mt-8 mb-10 gap-2">
            <button
              onClick={() => setCategory('game')}
              className={`flex items-center px-5 py-2 rounded-full ${
                category === 'game'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              } transition-colors duration-200`}
            >
              <Server className="w-4 h-4 mr-2" />
              Game Hosting
            </button>
            <button
              onClick={() => setCategory('discord')}
              className={`flex items-center px-5 py-2 rounded-full ${
                category === 'discord'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              } transition-colors duration-200`}
            >
              <Bot className="w-4 h-4 mr-2" />
              Discord Bots
            </button>
            <button
              onClick={() => setCategory('telegram')}
              className={`flex items-center px-5 py-2 rounded-full ${
                category === 'telegram'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              } transition-colors duration-200`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Telegram Bots
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {selectedPlans.map((plan, index) => (
            <div
              key={index}
              className={`
                bg-gray-800 rounded-xl overflow-hidden p-6 border border-gray-700 transition-transform duration-300 hover:scale-105 relative
                ${plan.highlighted ? 'md:scale-105 shadow-lg shadow-indigo-500/20 border-indigo-500/50' : ''}
              `}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-indigo-600 text-white text-center text-sm py-1">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className={`flex-shrink-0 mr-2 ${feature.included ? 'text-green-400' : 'text-gray-500'}`}>
                      {feature.included ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="block h-5 w-5 text-center">-</span>
                      )}
                    </span>
                    <span className={feature.included ? 'text-gray-300' : 'text-gray-500'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link
                to="#contact"
                className={`
                  block w-full text-center py-3 rounded-lg transition-colors duration-200 font-medium
                  ${
                    plan.highlighted
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }
                `}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;