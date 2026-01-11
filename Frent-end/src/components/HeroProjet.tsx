// HeroProjet.jsx
import React from "react";
import { ArrowDown, Sparkles, Play } from "lucide-react";

const HeroProjet = ({ domain, project }) => {
  const scrollToGalerie = () => {
    const galerieSection = document.getElementById("galerie");
    if (galerieSection) {
      galerieSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[55vh] min-h-[500px] w-full flex items-center justify-center text-white overflow-hidden">
      {/* Enhanced Background with Parallax Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img
          src={project.heroImage}
          alt={project.title}
          className="w-full h-full object-cover scale-110 transform transition-transform duration-7000 ease-out hover:scale-105"
        />
        {/* Multi-layer Gradient Overlay */}
        
        
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-[#D59B49]/10 to-transparent z-20"></div>
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 z-15 opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:20px_20px] animate-pulse"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-30 w-full max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center justify-center space-y-8">
          
          {/* Enhanced Badge with Icon */}
          <div className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-[#D59B49] to-[#e0b366] rounded-full border border-white/30 shadow-2xl backdrop-blur-md transform hover:scale-105 transition-all duration-300 group cursor-pointer">
            <Sparkles className="w-4 h-4 text-white mr-2 animate-pulse" />
            <span className="text-white font-bold uppercase tracking-widest text-sm drop-shadow-lg">
              {domain.title}
            </span>
            <div className="w-2 h-2 bg-white rounded-full ml-2 opacity-80 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* Main Title with Enhanced Typography */}
          <div className="text-center space-y-6 max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300 drop-shadow-2xl animate-gradient">
                {project.title}
              </span>
            </h1>
            
            {/* Optional Subtitle */}
            {project.subtitle && (
              <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
                {project.subtitle}
              </p>
            )}
          </div>

          {/* Enhanced CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
            <button
              onClick={scrollToGalerie}
              className="group relative inline-flex items-center px-10 py-4 bg-gradient-to-r from-[#D59B49] to-[#e0b366] text-white rounded-2xl font-bold text-lg shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-105 transform overflow-hidden"
            >
              {/* Animated Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              {/* Button Content */}
              <span className="relative z-10 tracking-wide drop-shadow-lg">EXPLORER LA GALERIE</span>
              <ArrowDown className="w-5 h-5 ml-3 relative z-10 transform group-hover:translate-y-1 transition-transform duration-300" />
            </button>

            {/* Secondary Button */}
<a
  href="/#video"
  className="group inline-flex items-center px-8 py-4 border-2 border-white/40 bg-white/5 backdrop-blur-lg text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/60 hover:scale-105 transform space-x-2"
>
  <span>VIDÉO PROJET</span>
</a>


          </div>
        </div>
      </div>

     
      
      {/* Animated Lines */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D59B49] to-transparent opacity-60 animate-pulse"></div>

    </section>
  );
};

export default HeroProjet;