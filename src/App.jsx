import { useState } from 'react';
import LoginForm from './LoginForm';
import CalendarView from './CalendarView';
import CalendarGrid from './components/CalendarGrid'; // ✅ Import our desktop grid

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-950 text-white">
      {isLoggedIn ? (
        <>
          {/* 🔝 Glassmorphic Navbar */}
          <nav className="w-full backdrop-blur-sm bg-white/10 border-b border-white/30 shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
            {/* Left – Icon + Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white shadow-md text-xl font-bold">
                ✚
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                Clinic Calendar
              </h1>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => setIsLoggedIn(false)}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-full shadow transition duration-300"
            >
              Logout
            </button>
          </nav>

          {/* 📅 Calendar Body (You can choose which to render or both) */}
          {/* For now, show CalendarGrid (desktop) */}
          <CalendarGrid />

          {/* Later you can switch based on screen size using media queries or hooks */}
          {/* <CalendarView /> */}
        </>
      ) : (
        <LoginForm onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
