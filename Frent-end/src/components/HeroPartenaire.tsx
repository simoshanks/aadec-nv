import heroactivites from "@/assets/hero.jpg"; 

const HeroPartenaire = () => {
  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={heroactivites}
        alt="Activités AADEC"
        className="absolute inset-0 w-full h-full object-cover brightness-75"
      />

      {/* Overlay Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          Nos Activités
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
          Découvrez nos projets actuels qui œuvrent pour l’éducation, 
          l’environnement, la citoyenneté et la solidarité.
        </p>
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent"></div>
    </section>
  );
};

export default HeroPartenaire;