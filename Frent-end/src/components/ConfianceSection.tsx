import React, { useRef, useEffect } from "react";
import { confianceCards } from "@/data/db"; 

const ConfianceSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    const cards = cardsRef.current;
    cards.forEach((card) => {
      if (card) observer.observe(card);
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      cards.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="bg-[#F9F6F0]  py-10 sm:py-14 lg:py-16 w-full relative overflow-hidden transition-all duration-1000"
    >
      {/* Title */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#146C2D] rounded-full mb-4 sm:mb-6 shadow-md shadow-emerald-100">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white rounded-full mr-2 sm:mr-3 animate-pulse"></span>
            <span className="text-white font-medium text-xs sm:text-sm uppercase tracking-wider">
              Principes de l'AADEC
            </span>
          </div>
          <div className="w-20 sm:w-24 lg:w-32 h-1 bg-[#146C2D] mx-auto mb-6 sm:mb-8 rounded-full shadow-sm"></div>
           <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Les principes fondamentaux qui guident notre engagement vers l'excellence et l'innovation
          </p>
        </div>

      {/* Cards Grid - محسّن للاستجابة */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8">
        {confianceCards.map((card, index) => (
          <div
            key={index}
            ref={addToRefs}
            className="group relative bg-white rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl lg:hover:shadow-2xl transition-all duration-500 ease-out border border-gray-100 overflow-hidden
                       h-[160px] sm:h-[180px] lg:h-[210px] 
                       hover:h-[220px] sm:hover:h-[240px] lg:hover:h-[280px]
                       opacity-0 translate-y-10 transition-all duration-500
                       flex flex-col"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#146C2D] via-[#D59B49] to-[#22A55D] rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            <div className="absolute inset-[2px] bg-white rounded-2xl lg:rounded-3xl z-0"></div>

            {/* Top accent */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#146C2D] to-[#22A55D] group-hover:w-full transition-all duration-500 ease-out rounded-full"></div>

            {/* Image */}
            <div className="absolute top-4 sm:top-5 lg:top-6 left-1/2 transform -translate-x-1/2 
                            w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden border-4 border-white shadow-lg z-20
                            group-hover:scale-105 lg:group-hover:scale-110 transition-all duration-500">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title */}
            <div className="pt-20 sm:pt-24 lg:pt-28 pb-3 px-3 sm:px-4 text-center relative z-20 flex-shrink-0">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#146C2D] transition-colors duration-300 leading-tight">
                {card.title}
              </h3>
            </div>

            {/* Description */}
            <div className="flex-1 px-3 sm:px-4 pb-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 delay-100 overflow-hidden">
              <div className="w-8 sm:w-10 h-0.5 bg-gradient-to-r from-[#146C2D] to-[#22A55D] mx-auto rounded-full mb-2"></div>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm font-light text-center line-clamp-5 sm:line-clamp-5">
                {card.description}
              </p>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#146C2D]/5 via-[#D59B49]/5 to-[#22A55D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl lg:rounded-3xl z-0"></div>
          </div>
        ))}
      </div>

      {/* Bottom indicator */}
      <div className="flex justify-center mt-16 lg:mt-20 relative z-10 opacity-0 transform translate-y-8 transition-all duration-700 delay-1200">
        <div className="flex items-center space-x-2">
          <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-[#D59B49] to-transparent rounded-full"></div>
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#146C2D] rounded-full animate-bounce"></div>
          <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-l from-[#D59B49] to-transparent rounded-full"></div>
        </div>
      </div>

      {/* CSS Animations */}
      <style >{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out forwards; }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-5 {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* تحسينات للشاشات الصغيرة جداً */
        @media (max-width: 360px) {
          .grid-cols-1 {
            grid-template-columns: 1fr;
          }
        }
        
        /* ضمان ظهور عمودين على الأقل للشاشات المتوسطة */
        @media (min-width: 475px) and (max-width: 639px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
};

export default ConfianceSection;