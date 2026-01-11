import React from "react";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Topbar from "@/components/Topbar";

import MapFAQ from "@/components/MapFAQ";
import ContactMain from "@/components/ContactMain";
import HeroContact from "@/components/HeroContact";
import ProjectDetails from "@/components/ProjectDetails";







const Contact = () => {
  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <Topbar />
      <Navigation />
      
      
      <HeroContact/>

      
      <ContactMain/>
      
      
      
      <MapFAQ />

      <Footer />
    </div>
  );
};

export default Contact;
