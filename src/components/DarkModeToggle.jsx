import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (enabled) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [enabled]);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 dark:border-white/20 bg-white/10 dark:bg-white/5 text-xl shadow transition hover:scale-105"
      title="Toggle Dark Mode"
    >
      {enabled ? "🌙" : "☀️"}
    </button>
  );
};

export default DarkModeToggle;
