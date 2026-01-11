// ProjetDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { domainsData } from "@/data/db.js";
import ProjetInfo from "@/components/ProjetInfo";
import HeroProjet from "@/components/HeroProjet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";

const ProjetDetail = () => {
  const { domainSlug, projectSlug } = useParams();

  const domain = domainsData.find((d) => d.slug === domainSlug);
  const project = domain?.projects.find((p) => p.slug === projectSlug);

  if (!domain || !project) {
    return <div className="text-center py-20">Projet non trouvé </div>;
  }

  return (
    <div className="bg-[#F5FCF8]">
      <Topbar />
      <Navigation />
      {/* heroImage ديال domain كـ خلفية للـ hero */}
      <HeroProjet domain={domain} project={project} />
      <ProjetInfo />
      <Footer />
    </div>
  );
};

export default ProjetDetail;
