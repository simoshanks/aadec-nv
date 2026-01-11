const HeroActule = ({ projet }) => {
  if (!projet) return null;

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `url(${projet.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
          <span className="text-xs sm:text-sm font-medium text-white/90">
            Depuis {projet.annee}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-snug">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-snug">
            {projet.slug === "Azicode-62" ? (
              <>
                École du Codage <span className="text-[#0877BC]"> Azicode</span><span className="text-[#212759]">62</span>
              </>
            ) : (
              projet.titre
            )}
          </h1>
        </h1>

        <p className="text-lg md:text-xl mb-4 font-light text-gray-200 leading-relaxed">
          {projet.description}
        </p>

        <div className="w-20 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
          {projet.linkSite && (
            <a
              href={projet.linkSite}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0877BC] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Site Web
            </a>
          )}

          <button
            onClick={() => {
              const gallerySection = document.getElementById("contact");
              if (gallerySection) gallerySection.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Contact
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroActule;
