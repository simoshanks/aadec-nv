import React from "react";
import ActualitesContent from "../components/ActualitesContent";
import Navigation from "@/components/Navigation";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

const Actualites= () => {
  return (
    <div>
     <Topbar/>
      <Navigation/>
            {/* Hero Section */}
      <div className=" bg-gradient-to-b from-[#D59B49] to-[#E6C698]  text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Actualités & Événements</h1>
            <p className="text-xl opacity-90">
              Restez informé des dernières nouvelles, événements et activités de notre association.
            </p>
          </div>
        </div>
      </div>
      <ActualitesContent />
      <Footer />
    </div>
  );
};

export default Actualites;
