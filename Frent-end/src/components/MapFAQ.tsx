import React from "react";
import { MapPin } from "lucide-react";

const MapFAQ = () => {
  return (
    <section className="bg-[#F9F6F0] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🔹 Titre */}
         <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#146C2D] rounded-full mb-4 sm:mb-6 shadow-md shadow-emerald-100">
              <MapPin className="w-6 h-6 text-white mr-2" />
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white rounded-full mr-2 sm:mr-3 animate-pulse"></span>
              <span className="text-white font-medium text-xs sm:text-sm uppercase tracking-wider">
                Notre Localisation
              </span>
            </div>
            <div className="w-20 sm:w-24 lg:w-32 h-1 bg-[#146C2D] mx-auto mb-6 sm:mb-8 rounded-full shadow-sm"></div>

            <p className="text-base lg:text-lg text-gray-700 max-w-2xl mx-auto mt-6 leading-relaxed font-medium">
              Venez nous rencontrer dans nos bureaux pour discuter de vos projets.
            </p>


          </div>

        {/* 🗺️ Carte Google */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[24rem] lg:h-[28rem] border border-[#22A55D]/20">
          <iframe
            title="Localisation Azilal"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2194.7701387153033!2d-6.566941678856704!3d31.966371000662647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda49a8f23f2a3e5%3A0x6daba4de3ff8425f!2sJardin%2020%20Ao%C3%BBt!5e0!3m2!1sfr!2sma!4v1760367079996!5m2!1sfr!2sma"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default MapFAQ;
