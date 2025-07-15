import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "./LoginForm";
import CalendarView from "./CalendarView";
import DarkModeToggle from "./components/DarkModeToggle";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-sans transition-colors duration-500">
      <AnimatePresence mode="wait">
        {isLoggedIn ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
          >
            <nav className="w-full backdrop-blur-sm bg-white/50 dark:bg-white/10 border-b border-gray-200 dark:border-white/30 shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#9333ea] to-[#7e22ce] rounded-full flex items-center justify-center text-white shadow-md text-xl font-bold">
                  ✚
                </div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  Clinic Calendar
                </h1>
              </div>
              <div className="flex gap-3 items-center">
                <DarkModeToggle />
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="bg-[#9333ea] hover:bg-[#7e22ce] text-white px-4 py-2 rounded-lg font-semibold shadow-md transition duration-200"
                >
                  Logout
                </button>
              </div>
            </nav>

            <CalendarView />
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
          >
            <LoginForm onLogin={() => setIsLoggedIn(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
