import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatedParticles } from "@/components/AnimatedParticles";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <AnimatedParticles />
      <div className="text-center relative z-10">
        <h1 className="mb-4 text-6xl font-bold text-cyan-400">404</h1>
        <p className="mb-6 text-xl text-slate-300">Oops! Page not found</p>
        <a href="/" className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
