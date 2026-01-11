import React from "react";
import { Mic } from "lucide-react";

const VideoSection = () => {
  return (
    <section id="video" className="w-full py-16 bg-[#F5FCF8] flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-12 lg:mb-14">
          <div className="inline-flex items-center px-4 py-2 bg-[#146C2D] backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            <span className="text-white font-semibold text-sm uppercase tracking-wider">
              Projets Terminés
            </span>
          </div>

        <div className="w-20 h-1 bg-gradient-to-r from-[#146C2D] to-[#22A55D] mx-auto mt-6 rounded-full"></div>
        <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          Vidéo de nos projets avec Organismes Européens
        </p>
      </div>

      {/* Video Container */}
      <div className="w-full max-w-4xl relative rounded-xl shadow-lg group cursor-pointer">
        {/* Video iframe */}
        <iframe
          className="w-full h-[500px] relative z-10 rounded-xl"
           src="https://www.youtube.com/embed/mtLE1lWtJO8"
          title="Notre Présentation"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        {/* Overlay top/center */}
        <div className="absolute top-0 left-0 right-0 h-full p-6 bg-gradient-to-b from-black/70 to-transparent z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-2xl">
            Projets Avec Organismes Européens
          </h3>
          <div className="flex items-center text-white/90 mt-2">
            <Mic className="w-6 h-6 text-white mr-3 drop-shadow-md" />
            <p className="text-base md:text-lg font-medium drop-shadow-md">
              Présenté par le professeur : Lamsallak Saïd
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
