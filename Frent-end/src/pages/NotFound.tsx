import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F6F0]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center p-8 bg-white rounded-3xl shadow-lg max-w-md w-full border border-[#D59B49]/30"
      >
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D59B49] to-[#b57a29] mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-2 text-[#4A3B23]">
          Page Not Found
        </h2>
        <p className="text-[#6B5A3C] mb-8">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-5 py-3 text-white font-medium bg-gradient-to-r from-[#D59B49] to-[#b57a29] rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <Home className="w-5 h-5" />
          Return Home
        </button>
      </motion.div>

      <footer className="absolute bottom-4 text-sm text-[#A98A54]">
        © {new Date().getFullYear()} — All rights reserved
      </footer>
    </div>
  );
};

export default NotFound;
