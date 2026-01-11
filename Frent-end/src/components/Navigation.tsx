import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Accueil", href: "/" },
    { name: "À propos", href: "/Apropos" },
    { name: "Actualités", href: "/Actualites" },
    { name: "Projets", href: "/projets" },
    { name: "Partenaires", href: "/Partenaires" },
    { name: "Documentation", href: "/Documentation" },
    { name: "Contact", href: "/Contact" },
  ];

  const adminNavItems = [
    ...navItems,
    ...(isAdmin ? [{ name: "Dashboard", href: "/admin/dashboard" }] : []),
  ];

  useEffect(() => {
    const checkAdmin = () => setIsAdmin(!!localStorage.getItem("adminToken"));
    checkAdmin();
    window.addEventListener("storage", checkAdmin);
    return () => window.removeEventListener("storage", checkAdmin);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src={logo}
              alt="AADEC Logo"
              className={`w-auto transition-all duration-300 ${
                isScrolled ? "h-12" : "h-14"
              }`}
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {adminNavItems.map((item) => {
              const isActive =
                window.location.pathname.toLowerCase() ===
                item.href.toLowerCase();

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative font-medium transition-colors duration-300
                    ${
                      isActive
                        ? "text-[#146C2D]"
                        : "text-gray-700 hover:text-[#146C2D]"
                    }
                    after:absolute after:left-0 after:-bottom-2 after:h-[2px]
                    after:bg-[#146C2D] after:transition-all after:duration-300
                    ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
                  `}
                >
                  {item.name}
                </a>
              );
            })}
          </div>

          {/* Mobile Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-gray-100 transition"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-100 mt-2 pt-4 pb-6 flex flex-col gap-2 bg-white/95 backdrop-blur">
            {adminNavItems.map((item) => {
              const isActive =
                window.location.pathname.toLowerCase() ===
                item.href.toLowerCase();

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition
                    ${
                      isActive
                        ? "text-[#146C2D] bg-gray-50"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#146C2D]"
                    }
                  `}
                >
                  {item.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
