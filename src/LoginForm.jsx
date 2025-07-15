import { radialGradient } from "framer-motion/client";
import { useState } from "react";

function LoginForm({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "staff@clinic.com" && password === "123456") {
      onLogin();
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    
  <div
    className="w-screen h-screen flex items-center justify-center font-[Jost] px-4 py-8"
    style={{
    backgroundImage: `url(${window.innerWidth < 768 
    ? '/images/clinic-login-phone-bg.webp' 
    : '/images/clinic-login-bg.webp'})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  }}
>

      <div className="relative w-full max-w-md h-[500px] bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20">
        <input
          type="checkbox"
          id="chk"
          className="peer hidden"
          checked={isSignUp}
          onChange={() => setIsSignUp(!isSignUp)}
        />

        {/* Sign Up Form */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ${
            isSignUp ? "translate-y-0" : "-translate-y-full"
          } z-10`}
        >
          <form className="h-full flex flex-col items-center justify-center px-8">
            <label
              htmlFor="chk"
              className="text-3xl text-white font-bold mb-6 cursor-pointer"
            >
              Sign Up
            </label>
            <input
              type="text"
              placeholder="Username"
              className="input-style"
            />
            <input type="email" placeholder="Email" className="input-style" />
            <input
              type="password"
              placeholder="Password"
              className="input-style"
            />
            <button
              type="button"
              className="btn-style bg-purple-600 hover:bg-purple-700 text-white"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Login Form */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ${
            isSignUp ? "translate-y-full" : "translate-y-0"
          } z-20`}
        >
          <form
            className="h-full flex flex-col items-center justify-center px-8"
            onSubmit={handleLogin}
          >
            <label
              htmlFor="chk"
              className="text-2xl text-white font-semibold mb-6 cursor-pointer tracking-wide"
            >
              Clinic Staff Login
            </label>
            <input
              type="email"
              placeholder="Email"
              className="input-style"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input-style"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="btn-style bg-purple-600 hover:bg-purple-700 text-white"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Tailwind helper styles
const style = document.createElement("style");
style.innerHTML = `
.input-style {
  width: 60%;
  padding: 12px;
  margin: 12px 0;
  border: none;
  border-radius: 8px;
  background-color: #e0dede;
  outline: none;
}
.btn-style {
  width: 60%;
  padding: 10px;
  margin-top: 24px;
  font-weight: bold;
  border-radius: 8px;
  transition: background 0.3s ease-in-out;
}
`;
document.head.appendChild(style);

export default LoginForm;
