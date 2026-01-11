import React from "react";
import { confianceCards } from "../data/db.js"; // بدّل المسار حسب فين عندك الداتا

const Value = () => {
  return (
    <section className="w-full px-4 py-20 bg-[#F9F6F0]">
     <div className="text-center mb-10 lg:mb-14 px-4">
               <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#146C2D] rounded-full mb-4 sm:mb-6 shadow-md shadow-emerald-100">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white rounded-full mr-2 sm:mr-3 animate-pulse"></span>
            <span className="text-white font-medium text-xs sm:text-sm uppercase tracking-wider">
              Principes de l'AADEC
            </span>
          </div>
          <div className="w-20 sm:w-24 lg:w-32 h-1 bg-[#146C2D] mx-auto mb-6 sm:mb-8 rounded-full shadow-sm"></div>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto mt-4 px-4">
          Les principes fondamentaux qui guident notre engagement vers l'excellence et l'innovation
        </p>
        </div>  
      </div>

      {/* Grid responsive: 2 kolom f mobile, 3/4 f larger screens */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10 justify-items-center">
        {confianceCards.map((card, idx) => (
          <li key={idx} className="flex flex-col items-center">
            {/* الصورة فدايرة */}
            <div
              className="w-40 h-40 md:w-40 md:h-40 rounded-full overflow-hidden shadow-xl 
                         transition-transform duration-300 hover:scale-125 ease-in-out"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            {/* العنوان */}
            <p className="mt-3 text-base md:text-lg font-bold text-[#146C2D] text-center">
              {card.title}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Value;
