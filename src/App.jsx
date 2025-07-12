import { useState } from 'react';
import LoginForm from './LoginForm';
import CalendarView from './CalendarView';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {isLoggedIn ? (
        <>
          {/* 🔝 Glassmorphic Navbar */}
          <nav className="w-full backdrop-blur-sm bg-white/30 border-b border-white/40 shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
            {/* Left – Medical Icon + App Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white shadow-md text-xl font-bold">
                ✚
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-800 tracking-tight">
                Clinic Calendar
              </h1>
            </div>

            {/* Right – Logout Button */}
            <button
              onClick={() => setIsLoggedIn(false)}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-full shadow transition duration-300"
            >
              Logout
            </button>
          </nav>

          {/* 📅 Calendar Body */}
          <CalendarView />
        </>
      ) : (
        <LoginForm onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
