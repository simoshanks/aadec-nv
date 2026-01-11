import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEnvironment,
} from "react-icons/ai";
import logo from "@/assets/logo.png";
import mapMorocco from "@/assets/map.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#D59B49] via-[#c58c40] to-[#b37d36] text-white relative overflow-hidden">
      {/* تأثير خلفية */}
      <div className="absolute inset-0 bg-black/5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16">
        {/* Main Grid - محسّن للجوال */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-6 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
          
          {/* Logo + Description */}
          <div className="text-center sm:text-left lg:col-span-1">
            <div className="flex justify-center sm:justify-start items-center space-x-3 mb-4">
              <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20">
                <img
                  src={logo}
                  alt="Logo AADEC"
                  className="h-10 sm:h-12 lg:h-14 w-auto object-contain filter brightness-0 invert"
                />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">AADEC</h3>
            <p className="text-white/90 text-xs sm:text-sm lg:text-base leading-relaxed max-w-md mx-auto sm:mx-0 font-light">
              Association Azilal pour le Développement, l'Environnement et la Communication.
              Engagée pour un avenir durable et prospère depuis 2000.
            </p>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left lg:col-span-1">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-4 sm:mb-6 pb-2 border-b border-white/30 inline-block">
              Contact
            </h3>
            <div className="space-y-3 sm:space-y-4 text-white/90">
              <div className="flex justify-center sm:justify-start items-center space-x-2 sm:space-x-3 group hover:text-white transition-colors duration-300">
                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
                  <AiOutlineEnvironment className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <span className="text-xs sm:text-sm lg:text-base font-medium break-words">
                  Quartier Administratif BP : 100 Azilal
                </span>
              </div>
              <div className="flex justify-center sm:justify-start items-center space-x-2 sm:space-x-3 group hover:text-white transition-colors duration-300">
                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
                  <AiOutlinePhone className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <span className="text-xs sm:text-sm lg:text-base font-medium">+212 6 61 79 11 18</span>
              </div>
              <div className="flex justify-center sm:justify-start items-center space-x-2 sm:space-x-3 group hover:text-white transition-colors duration-300">
                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
                  <AiOutlineMail className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <span className="text-xs sm:text-sm lg:text-base font-medium break-words">
                  aadec2000@hotmail.com
                </span>
              </div>
            </div>
          </div>

{/* Liens Rapides */}
<div className="text-center sm:text-left lg:col-span-1">
  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-4 sm:mb-6 pb-2 border-b border-white/30 inline-block">
    Liens Rapides
  </h3>

  <ul className="space-y-2 sm:space-y-3 text-white/90 font-medium list-none">
    {[
      { name: "Accueil", link: "/" },
      { name: "Actualités", link: "/Actualites" },
      { name: "Projets", link: "/Projets" },
      { name: "Partenaires", link: "/partenaires" },
      { name: "Contact", link: "/contact" },
    ].map((item) => (
      <li key={item.name}>
        <a
          href={item.link}
          className="inline-block text-xs sm:text-sm lg:text-base font-medium text-white/90 
                     transition-transform transition-colors duration-300 
                     hover:text-white hover:translate-x-1"
        >
          {item.name}
        </a>
      </li>
    ))}
  </ul>
</div>




          {/* Morocco Map */}
          <div className="flex flex-col items-center sm:items-start lg:col-span-1">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-4 sm:mb-6 pb-2 border-b border-white/30 inline-block">
              Localisation
            </h3>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
              <img
                src={mapMorocco}
                alt="Morocco map"
                className="w-full h-full object-contain opacity-90 filter brightness-0 invert"
              />

              <a
                href="https://maps.app.goo.gl/2FmX1dBHBtmUPW8H7"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute"
                style={{ top: "36%", left: "52%", transform: "translate(-50%, -50%)" }}
              >
                <span className="absolute inline-flex h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 rounded-full bg-red-400 opacity-70 animate-ping"></span>
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-3 lg:w-3">
                  <span className="absolute inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-3 lg:w-3 bg-red-500 border-2 border-white animate-pulse"></span>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar - محسّن للجوال */}
<div className="border-t border-white/30 pt-3 sm:pt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
  {/* Copyright */}
  <div className="text-center sm:text-left order-2 sm:order-1">
    <p className="text-white/80 text-xs sm:text-sm font-medium">
      © {currentYear} AADEC. Tous droits réservés.
    </p>
  </div>

  {/* Social Links */}
  <div className="text-center sm:text-left order-1 sm:order-2">
    <div className="flex justify-center sm:justify-start space-x-2 sm:space-x-3 mb-2 sm:mb-0">
      {[
        { icon: FaFacebookF, href: "https://www.facebook.com/share/16rxatcupq/" },
        { icon: FaWhatsapp, href: "https://wa.me/212624751985" },
        { icon: FaInstagram, href: "https://www.instagram.com/aadec_azilal/" }
      ].map((social, index) => (
        <a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
        >
          <social.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform duration-300" />
        </a>
      ))}
    </div>

 
  </div>
</div>

      </div>
    </footer>
  );
};

export default Footer;