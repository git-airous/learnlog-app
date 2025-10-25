import React from 'react';

const ProgressChart = ({ courses }) => {
  const calculateCourseProgress = (course) => {
    if (!course.checkpoints || course.checkpoints.length === 0) return 0;
    const completed = course.checkpoints.filter(cp => cp.completed).length;
    return Math.round((completed / course.checkpoints.length) * 100);
  };

  const chartData = courses.map((c, index) => ({
    name: c.name,
    percent: calculateCourseProgress(c),
    // Cycle through some Tailwind colors for variety
    color: ['bg-blue-500', 'bg-indigo-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500'][index % 5],
    textColor: ['text-blue-500', 'text-indigo-500', 'text-green-500', 'text-yellow-500', 'text-pink-500'][index % 5],
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300 col-span-full">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
        Progress Across Courses
      </h2>
      <div className="space-y-6 max-h-96 overflow-y-auto">
        {chartData.map((data, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span
                className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate line-clamp-2 cursor-pointer"
                title={data.name}
              >
                {data.name}
              </span>
              <span className={`text-sm font-bold ${data.textColor}`}>{data.percent}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full ${data.color}`}
                style={{ width: `${data.percent}%`, transition: 'width 1s ease-out' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;
