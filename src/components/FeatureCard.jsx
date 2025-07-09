
import React from 'react';

const FeatureCard = ({ icon, title, description, iconColor = "blue" }) => {
  const iconColorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600"
  };

  return (
    <div className="text-center p-6">
      <div className={`w-12 h-12 ${iconColorClasses[iconColor]} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
