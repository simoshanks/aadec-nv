import aboutImg from "@/assets/acceil.jpg";
import { useEffect, useState, useRef } from "react";

export default function AboutSection() {
  const [visible, setVisible] = useState(false);
  const [projectsCount, setProjectsCount] = useState(0);
  const [yearsCount, setYearsCount] = useState(0);
  const statsRef = useRef(null); // ✅ Ref pour la section des stats
  const [statsVisible, setStatsVisible] = useState(false);

  // ✅ Animation d'apparition de la section
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // ✅ Observer pour déclencher l'animation des chiffres au scroll
  useEffect(() => {
    if (!statsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
          observer.disconnect(); // on arrête l'observer après le trigger
        }
      },
      { threshold: 0.5 } // déclenche quand 50% de la section est visible
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // ✅ Animation des chiffres
  useEffect(() => {
    if (!statsVisible) return;

    let startProjects = 0;
    let startYears = 0;
    const duration = 2000;
    const steps = 60;
    const incrementProjects = 50 / steps;
    const incrementYears = 25 / steps;

    const interval = setInterval(() => {
      startProjects += incrementProjects;
      startYears += incrementYears;

      setProjectsCount(Math.floor(startProjects));
      setYearsCount(Math.floor(startYears));

      if (startProjects >= 50 && startYears >= 25) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [statsVisible]);

  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center py-12 lg:py-20 overflow-hidden">
      {/* Background Image + Gradient */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${aboutImg})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-28 h-28 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-16 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
        <div
          className={`transition-all duration-1000 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Badge */}
                 <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#146C2D] rounded-full mb-4 sm:mb-6 shadow-md shadow-emerald-100">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white rounded-full mr-2 sm:mr-3 animate-pulse"></span>
            <span className="text-white font-medium text-xs sm:text-sm uppercase tracking-wider">
              Qui sommes-nous
            </span>
          </div>
          <div className="w-20 sm:w-24 lg:w-32 h-1 bg-[#146C2D] mx-auto mb-6 sm:mb-8 rounded-full shadow-sm"></div>
        </div>

          {/* Titles */}
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
            Association Azilal pour le Développement
          </h1>
          <h2 className="text-xl lg:text-2xl font-semibold text-white/90 mb-6">
            Environnement et Communication (AADEC)
          </h2>

          {/* Description */}
          <div className="space-y-3 mb-8 max-w-3xl mx-auto lg:mx-0">
            <p className="text-base sm:text-lg text-white/90 leading-relaxed font-light">
              Créée à Azilal, l'AADEC œuvre pour le développement durable et la
              protection de l'environnement tout en favorisant la communication
              et la sensibilisation citoyenne.
            </p>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed font-light">
              L'association accompagne des initiatives locales, soutient des
              projets éducatifs, culturels et sociaux pour renforcer la
              solidarité dans la région.
            </p>
          </div>

          {/* Stats avec animation au scroll */}
          <div ref={statsRef} className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto lg:mx-0">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {projectsCount}+
              </div>
              <div className="text-white/70 text-sm font-medium">Projets Réalisés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {yearsCount}+
              </div>
              <div className="text-white/70 text-sm font-medium">Années d'Expérience</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <button
              onClick={() => (window.location.href = "/Apropos")}
             className="px-8 py-4 text-white bg-[#146C2D] font-bold rounded-xl hover:bg-[#0a3d19] transition-colors duration-300">
              <span className="relative flex items-center justify-center space-x-2 ">
                <span>En savoir plus</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            <button
              onClick={() => (window.location.href = "/partenaires")}
              className="group relative px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-base hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z"
                  />
                </svg>
                <span>Voir nos partenaires</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
