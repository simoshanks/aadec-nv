
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import AllProjets from "@/components/AllProjets";

const Projets = () => {
  

  

  return (
    <div className="bg-[#F9F6F0]">
      <Topbar />
      <Navigation />
            {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#D59B49] to-[#E6C698] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Projets & Réalisations</h1>
            <p className="text-xl opacity-90">
              Projets et réalisations illustrant notre engagement et nos actions sur le terrain.
            </p>
          </div>
        </div>
      </div>
      <AllProjets/>

      
      <Footer />
    </div>
  );
};

export default Projets;
