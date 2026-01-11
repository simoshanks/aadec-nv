import AllProjets from "@/components/AllProjets";
import Footer from "@/components/Footer";
import HeroAbout from "@/components/HeroAbout";
import MissionVision from "@/components/MissionVision";
import Navigation from "@/components/Navigation";
import ProjectsTimeline from "@/components/ProjectsTimelin";

import Topbar from "@/components/Topbar";
import Value from "@/components/ValueI";

const Apropos = () => {
  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <Topbar/>
      <Navigation/>
      <HeroAbout />
      <ProjectsTimeline/>
      
      <MissionVision/>
      <Value />

      <Footer />
    </div>
  );
};

export default Apropos;
