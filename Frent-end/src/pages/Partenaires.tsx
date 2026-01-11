import Footer from "@/components/Footer";

import Navigation from "@/components/Navigation";
import Partenairetype from "@/components/Partenairetype";
import Topbar from "@/components/Topbar";

const Partenaires = () => {
  


  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <Topbar/>
      <Navigation />
          {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#D59B49] to-[#E6C698] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Partenaires & Réseau de Confiance</h1>
            <p className="text-xl opacity-90">
             Des partenariats solides avec des institutions de référence pour un impact durable et une expertise partagée dans nos actions.
            </p>
          </div>
        </div>
      </div>
      <Partenairetype/>
      <Footer />
    </div>
  );
};

export default Partenaires;