import hero1 from "@/assets/social.jpg";
import hero2 from "@/assets/herofistival.jpg";
import hero3 from "@/assets/imagehero.jpg";
import { useState, useEffect } from "react";

const slides = [
  {
    image: hero1,
    phrase: "AADEC : 25 ans d’engagement au service du développement local",
    subtitle:
      "Un quart de siècle de travail sérieux pour un développement durable et solidaire",
  },
  {
    image: hero2,
    phrase:
      "Depuis le premier festival local en 2001 jusqu’aux projets actuels en 2025",
    subtitle:
      "Une continuité d’actions et d’initiatives au service de la communauté",
  },
  {
    image: hero3,
    phrase: "Construisons ensemble un avenir meilleur",
    subtitle:
      "Une association engagée pour le progrès social et territorial",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => handleNext(), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 700);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setIsTransitioning(false);
    }, 700);
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden pt-24 md:pt-32">
      {/* Background slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt="Hero background"
            className="w-full h-full object-cover animate-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/60" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 w-full max-w-6xl px-4 text-center">
        <div
          className={`transition-all duration-700 ease-out ${
            isTransitioning
              ? "opacity-0 translate-y-6"
              : "opacity-100 translate-y-0"
          }`}
        >
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-5 leading-relaxed drop-shadow-xl">
            <span className="bg-gradient-to-r from-white via-[#EAD8A0] to-[#D59B49] bg-clip-text text-transparent">
              {slides[current].phrase}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-9 max-w-4xl mx-auto leading-relaxed font-light">
            {slides[current].subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => (window.location.href = "/projets")}
              className="px-8 py-3 rounded-xl bg-[#D59B49] text-white font-semibold shadow-lg transition-all duration-300 hover:bg-[#b77f39] hover:-translate-y-0.5"
            >
              Découvrir nos actions
            </button>

            <button
              onClick={() => (window.location.href = "/contact")}
              className="px-8 py-3 rounded-xl border border-white/70 bg-white/5 text-white font-semibold shadow-md backdrop-blur transition-all duration-300 hover:bg-white/15"
            >
              Contactez-nous
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-10 bg-[#D59B49]"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 items-center justify-center text-white hover:bg-white/20 transition"
      >
        ‹
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 items-center justify-center text-white hover:bg-white/20 transition"
      >
        ›
      </button>

      {/* Animations */}
      <style>{`
        @keyframes zoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-zoom {
          animation: zoom 28s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
