import React from "react";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const Header = ({ darkMode, toggleDarkMode }) => {
  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md z-10">
      <div className="flex items-center cursor-pointer shadow-md transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl" onClick={goHome}>
        <PencilSquareIcon className="w-8 h-8 text-indigo-500 mr-2" />
        <h1 className="text-xl font-bold tracking-wider text-gray-900 dark:text-gray-100">
          LearnLog
        </h1>
      </div>

      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {darkMode ? (
          <SunIcon className="w-6 h-6 text-yellow-400" />
        ) : (
          <MoonIcon className="w-6 h-6 text-gray-700" />
        )}
      </button>
    </header>
  );
};

export default Header;
