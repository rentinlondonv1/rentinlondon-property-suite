
import React from 'react';
import { Search, UserRound, Home } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Search & Filter",
      description: "Use our advanced search to find the perfect property by location, price, and features",
      icon: <Search className="w-8 h-8 text-white" />
    },
    {
      number: 2,
      title: "Contact & Schedule",
      description: "Directly contact landlords or agents to schedule viewings at your convenience",
      icon: <UserRound className="w-8 h-8 text-white" />
    },
    {
      number: 3,
      title: "Move In",
      description: "Complete the verification process, sign your contract, and move into your new home",
      icon: <Home className="w-8 h-8 text-white" />
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our simple 3-step process makes finding and renting your ideal London home
            quick and stress-free
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8 text-center relative">
              <div className="flex justify-center">
                <div className="bg-rentblue-600 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-4xl font-bold text-rentblue-800 mb-6">{step.number}</h3>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h4>
              <p className="text-gray-600">{step.description}</p>
              
              {/* Connector line (except for the last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
