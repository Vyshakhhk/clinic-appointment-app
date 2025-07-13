// src/components/DarkModeToggle.jsx
import { useEffect, useState } from "react";

function DarkModeToggle() {
  const [dark, setDark] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="text-sm px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 dark:text-white transition"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

export default DarkModeToggle;
