import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { domainsData } from "@/data/db";
import GallerySection from "./GallerySection";

const ProjetInfo = () => {
  const { domainSlug, projectSlug } = useParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Find domain & project
  const domain = domainsData.find((d) => d.slug === domainSlug);
  
  if (!domain) return <p className="text-red-600 text-center py-6"> Domaine introuvable</p>;

  const project = domain.projects.find((p) => p.slug === projectSlug);
  if (!project) return <p className="text-red-600 text-center py-6"> Projet introuvable</p>;

  return (
    <div className="min-h-screen bg-[#F5FCF8] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-3 mb-12" aria-label="Fil d'Ariane">
          {/* Accueil */}
          <div className="flex items-center space-x-3">

            <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-[#146C2D] group-hover:to-[#22A55D] transition-all duration-300 shadow-sm">
              <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="hidden sm:block text-black">Accueil</span>


            {/* Séparateur */}
            <div className="flex items-center">
              <svg className="w-4 h-4 text-[#146C2D] mx-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Domaines */}
          <div className="flex items-center space-x-3">

            <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-[#146C2D] group-hover:to-[#22A55D] transition-all duration-300 shadow-sm">
              <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="hidden sm:block text-black">Domaines</span>


            {/* Séparateur */}
            <div className="flex items-center">
              <svg className="w-4 h-4 text-[#146C2D] mx-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Domaine actuel */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#146C2D] to-[#22A55D] rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-[#146C2D] font-semibold capitalize bg-gradient-to-r from-[#146C2D] to-[#22A55D] bg-clip-text text-transparent">
              {domain.title}
            </span>
          </div>
        </nav>

        {/* Main Card */}
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-1000 ease-out transform hover:shadow-3xl ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {/* Card Header avec design premium */}
          <div className="relative bg-gradient-to-r from-[#146C2D] via-[#1A7A38] to-[#22A55D] p-8 lg:p-10 text-white overflow-hidden">
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>

            {/* Pattern subtile */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] bg-[length:20px_20px]"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  {/* Badge avec effet premium */}
                  <div className="inline-flex items-center px-4 py-2.5 bg-white/20 rounded-2xl backdrop-blur-sm mb-6 border border-white/30 shadow-lg">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-3 animate-pulse shadow-glow"></span>
                    <span className="text-sm font-semibold uppercase tracking-wider text-white">
                      {domain.title}
                    </span>
                  </div>

                  {/* Titre principal */}
                <h1 className="text-4xl lg:text-5xl font-bold mt-2 mb-6 pb-2 leading-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
               {project.title}
               </h1>


                  {/* Sous-titre optionnel */}
                  {project.subtitle && (
                    <p className="text-xl text-white/80 font-light max-w-2xl leading-relaxed">
                      {project.subtitle}
                    </p>
                  )}
                </div>

                {/* Carte année avec design premium */}
                <div className="flex items-center space-x-3 bg-white/15 rounded-2xl px-6 py-4 backdrop-blur-sm border border-white/20 shadow-xl hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/80 text-sm font-medium uppercase tracking-wide">Année</div>
                    <div className="text-2xl font-bold text-white">{project.year}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body avec design sophistiqué */}
          <div className="p-8 lg:p-10 bg-gradient-to-br from-white to-gray-50/50">
            <div className="max-w-none">
              {/* En-tête de section */}
              <div className="flex items-center mb-8 pb-6 border-b border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-[#146C2D] to-[#22A55D] rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Description du Projet</h2>
              </div>

              {/* Description avec typographie améliorée */}
              <div className="prose prose-lg max-w-none">
                <p
                  className="text-gray-700 leading-relaxed text-lg lg:text-xl font-light tracking-wide mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                  style={{ whiteSpace: "pre-line", lineHeight: '1.8' }}
                >
                  {project.description}
                </p>
              </div>

              {/* Stats et métriques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Gallery Info améliorée */}
                {project.gallery && project.gallery.length > 0 && (
                  <div className="bg-gradient-to-br from-[#146C2D] to-[#22A55D] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{project.gallery.length}</div>
                        <div className="text-white/90 text-sm font-medium">Photos{project.gallery.length > 1 ? 's' : ''}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Statut du projet */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#D59B49] rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">Statut</div>
                      <div className="text-gray-600 text-sm">Terminé</div>
                    </div>
                  </div>
                </div>

                {/* Domaine */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#146C2D] to-[#22A55D] rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 capitalize">{domain.title}</div>
                      <div className="text-gray-600 text-sm">Domaine</div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* Styles CSS pour les animations */}
        <style >{`
  @keyframes shine {
    0% { transform: translateX(-100%) skewX(-12deg); }
    100% { transform: translateX(200%) skewX(-12deg); }
  }
  .animate-shine {
    animation: shine 3s ease-in-out infinite;
  }
  .shadow-glow {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  .shadow-3xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
`}</style>

{/* Gallery Section */}
{project.gallery && project.gallery.length > 0 && (
  <div className="mt-8 lg:mt-12"> {/* <-- giảm khoảng cách từ 16/20 -> 8/12 */}
    {/* En-tête de section avec design premium */}
    <div className="text-center mb-8 lg:mb-12"> {/* <-- giảm margin bottom */}
      <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#146C2D] to-[#22A55D] rounded-2xl shadow-2xl mb-6"> {/* <-- giảm mb */}
        <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse shadow-glow"></div>
        <span className="text-white font-semibold uppercase tracking-wider text-sm">
          Galerie du Projet
        </span>
      </div>

      <div className="w-24 h-1.5 bg-gradient-to-r from-[#146C2D] to-[#22A55D] mx-auto mb-6 rounded-full shadow-lg"></div> {/* <-- giảm mb */}

      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
        Découvrez les moments forts et les réalisations de ce projet à travers notre galerie photo .  <span className="block mt-1 text-[#146C2D] font-medium">
    Cliquez sur la photo pour la découvrir
  </span>
      </p>

      <GallerySection
        gallery={project.gallery}
        title={project.title}
      />
    </div>
  </div>
)}

        </div>
    </div>
  );
};

export default ProjetInfo;