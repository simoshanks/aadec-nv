import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import OtherSection from '@/components/ProjectSection';

import Footer from '@/components/Footer';
import ConfianceSection from '@/components/ConfianceSection';
import AboutSection from '@/components/AboutSection';
import ProjectSection from '@/components/ProjectSection';
import CoverflowSwiper from '@/components/CoverflowSwiper';
import Topbar from '@/components/Topbar';
import PartnersCarousel from '@/components/PartnersCarousel';
import { useEffect } from 'react';
import ActualitesSection from '@/components/ActualitesSection';

const Index = () => {
   useEffect(() => {
    // ملي الصفحة تتبدل، تحقق واش كاين هاش فـ URL
    const hash = window.location.hash;
    if (hash) {
      const section = document.querySelector(hash);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 300); // نزيدو تأخير بسيط باش يكون كلشي محمل
      }
    }
  }, []);
  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <Topbar/>
      <Navigation/>
      
      
      <HeroSection />
      <PartnersCarousel/>
      <AboutSection/>
      <ActualitesSection/>
      <ProjectSection/>
      <ConfianceSection />
      <CoverflowSwiper />
      <Footer />
    </div>
  );
};

export default Index;
