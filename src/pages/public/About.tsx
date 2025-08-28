import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">About MDRRMO</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 mb-6">
            The Municipal Disaster Risk Reduction and Management Office (MDRRMO) of Pio Duran serves as the primary agency responsible for ensuring the safety and resilience of our community through comprehensive disaster risk reduction and management strategies.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Our office is committed to protecting lives, property, and the environment through proactive planning, effective response, and sustainable recovery efforts. We work closely with local government units, community organizations, and residents to build a disaster-resilient municipality.
          </p>
          <p className="text-lg text-gray-700">
            Through continuous training, community education, and strategic partnerships, we strive to minimize the impact of natural and human-induced hazards while enhancing the capacity of our community to prepare for, respond to, and recover from disasters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;