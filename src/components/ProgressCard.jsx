import React from "react";

const ProgressCard = ({ progress, className = "" }) => {
  const radius = 80;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md transform transition-all duration-300 hover:scale-102 hover:shadow-xl ${className}`}
    >
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
        Overall Progress
      </h2>
      <div className="flex justify-center items-center relative">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="currentColor"
            className="text-gray-300 dark:text-gray-700"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#6366f1"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference + " " + circumference}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute text-4xl font-semibold text-indigo-500">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default ProgressCard;
