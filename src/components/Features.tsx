import React from 'react';
import { 
  Server, 
  Bot, 
  MessageCircle, 
  Cpu, 
  Shield, 
  Clock, 
  Activity, 
  Globe, 
  Zap,
  BarChart3
} from 'lucide-react';

interface FeatureSectionProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: Array<{
    name: string;
    description: string;
    icon: React.ReactNode;
  }>;
  bgClass: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  id,
  title,
  description,
  icon,
  features,
  bgClass
}) => {
  return (
    <section id={id} className={`py-20 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <div className="flex items-center mb-4">
              <div className="mr-4 p-2 rounded-lg bg-opacity-20 bg-indigo-800">{icon}</div>
              <h2 className="text-3xl font-bold text-white">{title}</h2>
            </div>
            <p className="text-xl text-gray-300 mb-8">{description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 backdrop-blur-sm transition-transform hover:scale-105"
                >
                  <div className="flex items-center mb-3">
                    <div className="mr-3 text-indigo-400">{feature.icon}</div>
                    <h3 className="font-semibold text-white">{feature.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const sections = [
    {
      id: "features",
      title: "Powerful Features", 
      description: "Experience cutting-edge hosting technology with our comprehensive feature set",
      icon: <Server className="w-6 h-6 text-indigo-400" />,
      bgClass: "bg-gray-900",
      features: [
        {
          name: "High Performance",
          description: "Blazing fast servers with optimized configurations for maximum performance",
          icon: <Zap className="w-5 h-5" />
        },
        {
          name: "24/7 Monitoring", 
          description: "Continuous monitoring and alerts to keep your services running smoothly",
          icon: <Activity className="w-5 h-5" />
        },
        {
          name: "Global Network",
          description: "Strategically located servers for low-latency access worldwide", 
          icon: <Globe className="w-5 h-5" />
        },
        {
          name: "Advanced Analytics",
          description: "Detailed insights and metrics to track your server's performance",
          icon: <BarChart3 className="w-5 h-5" />
        }
      ]
    }
  ];

  return (
    <>
      {sections.map((section) => (
        <FeatureSection key={section.id} {...section} />
      ))}
    </>
  );
};

export default Features;