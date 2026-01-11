import React from "react";
import missionBg from "@/assets/fierté.png"; // ✅ الصورة من assets

const MissionVision = () => {
  return (
    <section
      className="relative bg-fixed bg-center bg-cover text-white py-20"
      style={{ backgroundImage: `url(${missionBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative container mx-auto text-center max-w-3xl">
        <h2 className="text-4xl font-bold mb-6">Notre Mission</h2>
        <p className="text-lg leading-relaxed mb-12">
          Nous œuvrons pour promouvoir le développement durable, renforcer la
          solidarité et encourager l’innovation au service de la communauté locale et régionale .
        </p>

        <h2 className="text-4xl font-bold mb-6">Notre Vision</h2>
        <p className="text-lg leading-relaxed">
          Construire un avenir inclusif et prospère, basé sur le respect de
          l’environnement et l’engagement citoyen.
        </p>
      </div>
    </section>
  );
};

export default MissionVision;
