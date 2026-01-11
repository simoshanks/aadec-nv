import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import heroImg from "@/assets/heroAADEC.jpg";

function HeroContact() {
  const text = "Contactez-nous";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let timeout;

    const type = () => {
      setDisplayedText(text.slice(0, index + 1));
      index++;

      if (index < text.length) {
        timeout = setTimeout(type, 150);
      } else {
        timeout = setTimeout(() => {
          index = 0;
          setDisplayedText("");
          type();
        }, 3000);
      }
    };

    type();
    return () => clearTimeout(timeout);
  }, []);

  const contactItems = [
    {
      icon: <FaMapMarkerAlt className="w-5 h-5 text-white" />,
      title: "Adresse",
      text: "Quartier Administratif BP : 100 Azilal",
      bg: "bg-gradient-to-br from-[#146C2D] to-[#0D4A1F]",
      delay: 0.1
    },
    {
      icon: <FaPhoneAlt className="w-5 h-5 text-white" />,
      title: "Téléphone",
      text: " +212 6 61 79 11 18  \n  +212 6 24 75 19 85 ",
      bg: "bg-gradient-to-br from-[#22A55D] to-[#146C2D]",
      delay: 0.2
    },
    {
      icon: <FaEnvelope className="w-5 h-5 text-white" />,
      title: "Email",
      text: "aadec2000@hotmail.com",
      bg: "bg-gradient-to-br from-[#146C2D] to-[#0D4A1F]",
      delay: 0.3
    },
    {
      icon: <FaClock className="w-5 h-5 text-white" />,
      title: "Horaires",
      text: "Lun - Ven: 8h00 - 18h00\nSam: 8h00 - 12h00",
      bg: "bg-gradient-to-br from-[#22A55D] to-[#146C2D]",
      delay: 0.4
    }
  ];

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#F9F6F0]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(20,108,45,0.2)_1px,transparent_0)] bg-[length:40px_40px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-4">

              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Le Siège de{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#146C2D] to-[#22A55D]">
                  l'Association
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Appelez, écrivez ou trouvez votre chemin vers notre centre. 
                Notre équipe est à votre écoute pour répondre à toutes vos questions.
              </p>
            </div>

            {/* Contact Items */}
            <div className="grid gap-6">
              {contactItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay, duration: 0.6 }}
                  className="group flex items-start space-x-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[#146C2D] font-medium whitespace-pre-line leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <a href="https://wa.me/212624751985" className="group inline-flex items-center justify-center px-8 py-4 bg-[#146C2D] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform space-x-3">
                <FaWhatsapp className="w-6 h-6" />
                
                <span>WhatsApp</span>
              </a>
              
<button
  onClick={() => {
    const formSection = document.getElementById("rendezvous");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  }}
  className="group inline-flex items-center justify-center px-8 py-4 border-2 border-[#146C2D] text-[#146C2D] rounded-2xl font-bold text-lg bg-white/80 backdrop-blur-sm hover:bg-[#146C2D] hover:text-white transition-all duration-300 hover:scale-105 transform"
>
  <span>Prendre Rendez-vous</span>
</button>

            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              {/* Image Container */}
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={heroImg}
                  alt="Siège de l'Association"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#22A55D] rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-gray-900">Ouvert</span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#D59B49] rounded-full opacity-80"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#146C2D] rounded-full opacity-60"></div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -z-10 top-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#D59B49] to-[#e0b366] rounded-3xl opacity-20"></div>
            <div className="absolute -z-10 bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-[#146C2D] to-[#22A55D] rounded-2xl opacity-20"></div>
          </motion.div>
        </div>

        {/* Animated Typing Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-16 md:mt-24"
        >
          <h2
            style={{
              WebkitTextStroke: "2px #146C2D",
              color: "transparent",
            }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
          >
            {displayedText}
            <span className="text-[#146C2D] animate-pulse">|</span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
            N'hésitez pas à nous contacter pour toute information supplémentaire
          </p>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-16"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-[#146C2D]"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-[#146C2D]"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-[#146C2D]"
          ></path>
        </svg>
      </div>
    </section>
  );
}

export default HeroContact;