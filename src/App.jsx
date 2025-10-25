import React from "react";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import useTheme from "./hooks/useTheme";

function App() {
  const [darkMode, toggleDarkMode] = useTheme();

  const headIcon = document.getElementById("head-icon");

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      headIcon.href = "/pencil-icon-dark.svg";
    } else {
      headIcon.href = "/pencil-icon-light.svg";
    }
  });

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Dashboard darkMode={darkMode} />
    </div>
  );
}

export default App;
