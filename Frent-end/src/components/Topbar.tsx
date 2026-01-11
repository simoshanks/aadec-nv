import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaUserLock,
  FaSignOutAlt,
} from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { X } from "lucide-react";
import AdminLoginModal from "./AdminLoginModal";

const Topbar = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("adminToken");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const confirmLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setConfirmLogoutOpen(false);
    window.location.href = "/";
  };

  return (
    <>
      {/* Topbar */}
      <div className="bg-[#146C2D] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center py-2 gap-3">

            {/* Left - Contact */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="tel:+212661791118"
                className="flex items-center gap-2 hover:text-white/90 transition-colors"
              >
                <HiOutlinePhone className="w-4 h-4" />
                <span className="font-medium tracking-wide">
                  +212 6 61 79 11 18
                </span>
              </a>

              <span className="hidden sm:block text-white/40">|</span>

              <a
                href="mailto:aadec2000@hotmail.com"
                className="flex items-center gap-2 hover:text-white/90 transition-colors"
              >
                <HiOutlineMail className="w-4 h-4" />
                <span className="font-medium tracking-wide">
                  aadec2000@hotmail.com
                </span>
              </a>
            </div>

            {/* Right - Social + Admin */}
            <div className="flex items-center gap-4">
              {/* Social */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/people/AADEC-azilal/100064177625574/?rdid=v7qdNJWQbIUKXSIq&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16rxatcupq%2F"
                  aria-label="Facebook"
                  className="hover:text-white/80 transition-colors"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/212624751985"
                  aria-label="WhatsApp"
                  className="hover:text-white/80 transition-colors"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/aadec_azilal/"
                  aria-label="Instagram"
                  className="hover:text-white/80 transition-colors"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
              </div>

              <span className="text-white/40">|</span>

              {/* Admin */}
              {isLoggedIn ? (
                <button
                  onClick={() => setConfirmLogoutOpen(true)}
                  className="flex items-center gap-2 hover:text-white/80 transition-colors"
                  title="Déconnexion"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">
                    Déconnexion
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setOpenLogin(true)}
                  className="flex items-center gap-2 hover:text-white/80 transition-colors"
                  title="Admin"
                >
                  <FaUserLock className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />

      {/* Logout Confirmation */}
      {confirmLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setConfirmLogoutOpen(false)}
          />

          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <button
              onClick={() => setConfirmLogoutOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 text-center mb-3">
              Confirmation
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Voulez-vous vraiment vous déconnecter ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmLogoutOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              >
                Annuler
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-[#146C2D] hover:bg-[#0f5222] text-white rounded-lg transition"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
