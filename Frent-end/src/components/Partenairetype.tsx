import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Partenaire {
  id: string;
  nom: string;
  logo?: string;
}

interface Categorie {
  id: string;
  titre: string;
  description: string;
  partenaires: Partenaire[];
}

const API_URL = import.meta.env.VITE_API_URL;

const Partenairetype = () => {
  const [categoriesPartenaires, setCategoriesPartenaires] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>({});
  const scrollRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const processPartenaireLogo = (partenaire: Partenaire): Partenaire => {
    if (!partenaire.logo) return partenaire;
    if (partenaire.logo.startsWith("http")) return partenaire;
    if (partenaire.logo.startsWith("/uploads/logos/")) return { ...partenaire, logo: `${API_URL}${partenaire.logo}` };
    if (!partenaire.logo.includes("/")) return { ...partenaire, logo: `${API_URL}/uploads/logos/${partenaire.logo}` };
    return { ...partenaire, logo: `${API_URL}${partenaire.logo.startsWith("/") ? "" : "/"}${partenaire.logo}` };
  };

  const processCategoriesData = (data: Categorie[]): Categorie[] =>
    data.map((c) => ({ ...c, partenaires: c.partenaires.map(processPartenaireLogo) }));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/partenaires/categories`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        const processedData = processCategoriesData(data);
        setCategoriesPartenaires(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsPaused(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const intervals = scrollRefs.current.map((ref) => {
      if (!ref) return null;
      const scrollSpeed = 1;
      return setInterval(() => {
        if (!isPaused && ref) {
          const maxScroll = ref.scrollWidth - ref.clientWidth;
          ref.scrollLeft += scrollSpeed;
          if (ref.scrollLeft >= maxScroll - 2) {
            setTimeout(() => ref.scrollTo({ left: 0, behavior: "smooth" }), 100);
          }
        }
      }, 20);
    });
    return () => intervals.forEach((i) => i && clearInterval(i));
  }, [isPaused, isMobile]);

  const handleScroll = (ref: HTMLDivElement | null, direction: "left" | "right") => {
    if (!ref) return;
    const distance = isMobile ? 200 : 300;
    ref.scrollBy({ left: direction === "left" ? -distance : distance, behavior: "smooth" });
  };

  const handleTouchStart = (e: React.TouchEvent, refIndex: number) => {
    if (!scrollRefs.current[refIndex]) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRefs.current[refIndex]!.offsetLeft);
    setScrollLeft(scrollRefs.current[refIndex]!.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent, refIndex: number) => {
    if (!isDragging || !scrollRefs.current[refIndex]) return;
    e.preventDefault();
    const x = e.touches[0].pageX - scrollRefs.current[refIndex]!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRefs.current[refIndex]!.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => setIsDragging(false);
  const handleImageLoad = (key: string) => setImagesLoaded((prev) => ({ ...prev, [key]: true }));

  const scrollToIndex = (refIndex: number, dotIndex: number) => {
    const ref = scrollRefs.current[refIndex];
    if (!ref) return;
    const itemWidth = ref.scrollWidth / (categoriesPartenaires[refIndex]?.partenaires.length || 1);
    ref.scrollTo({ left: itemWidth * dotIndex * 3, behavior: "smooth" });
  };

  const normalize = (str: string) => str.trim().toLowerCase();

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="container mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
            <div className="flex justify-center space-x-4 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-32 h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (categoriesPartenaires.length === 0) return <div className="text-center">No partners found</div>;

  const horizontalCategoriesOrdered = [
    ...categoriesPartenaires.filter((c) => normalize(c.titre) === "bailleurs de fonds"),
    ...categoriesPartenaires.filter((c) => normalize(c.titre) === "les réseaux"),
  ];

  const normalCategories = categoriesPartenaires.filter(
    (c) => !["bailleurs de fonds", "les réseaux"].includes(normalize(c.titre))
  );

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[#F9F6F0]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* HEADER */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#146C2D] rounded-full mb-4 sm:mb-6 shadow-md shadow-emerald-100">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white rounded-full mr-2 sm:mr-3 animate-pulse"></span>
            <span className="text-white font-medium text-xs sm:text-sm uppercase tracking-wider">
              Nos Partenaires Stratégiques
            </span>
          </div>

 

          <div className="w-20 sm:w-24 lg:w-32 h-1 bg-[#146C2D] mx-auto mb-6 sm:mb-8 rounded-full shadow-sm"></div>

        </div>

        {/* HORIZONTAL */}
        {horizontalCategoriesOrdered.map((categorie, index) => (
          <div key={categorie.id} className="relative mb-12 sm:mb-16 lg:mb-24">
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#146C2D] mb-2 sm:mb-3">
                {categorie.titre}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto font-light px-4">
                {categorie.description}
              </p>
            </div>

            <div
              className="relative group max-w-6xl mx-auto"
              onMouseEnter={() => !isMobile && setIsPaused(true)}
              onMouseLeave={() => !isMobile && setIsPaused(false)}
            >
              <button
                onClick={() => handleScroll(scrollRefs.current[index], "left")}
                className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#146C2D] p-1.5 sm:p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300 z-10"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>
              <button
                onClick={() => handleScroll(scrollRefs.current[index], "right")}
                className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#146C2D] p-1.5 sm:p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300 z-10"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>

              <div
                ref={(el) => (scrollRefs.current[index] = el)}
                className={`flex space-x-3 sm:space-x-4 lg:space-x-6 px-3 sm:px-4 lg:px-6 ${
                  isMobile ? "overflow-x-auto scroll-smooth" : "overflow-hidden"
                }`}
                onTouchStart={(e) => handleTouchStart(e, index)}
                onTouchMove={(e) => handleTouchMove(e, index)}
                onTouchEnd={handleTouchEnd}
              >
                <div className="scroll-track flex space-x-3 sm:space-x-4 lg:space-x-6">
                  {categorie.partenaires.map((partenaire, i) => {
                    const imageKey = `${categorie.id}-${partenaire.id}`;
                    return (
                      <div
                        key={i}
                        className="flex-shrink-0 flex flex-col items-center bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 min-w-[140px] sm:min-w-[160px] lg:min-w-[200px] p-3 sm:p-4 lg:p-6 border border-gray-100 group/item"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center bg-gray-25 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 lg:mb-4 group-hover/item:scale-105 sm:group-hover/item:scale-110 transition-transform duration-300 shadow-inner">
                          {partenaire.logo ? (
                            <div className="relative">
                              <img
                                src={partenaire.logo}
                                alt={partenaire.nom}
                                loading="lazy"
                                onLoad={() => handleImageLoad(imageKey)}
                                className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-contain filter grayscale group-hover/item:grayscale-0 transition-all duration-700 ${
                                  imagesLoaded[imageKey] ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {!imagesLoaded[imageKey] && (
                                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                              )}
                            </div>
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md group-hover/item:scale-105 transition-transform duration-300">
                              <span className="text-white font-bold text-xs sm:text-sm px-1 text-center leading-tight">
                                {partenaire.nom
                                  .split(" ")
                                  .slice(0, 2)
                                  .map((w) => w[0] || "")
                                  .join("")
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight line-clamp-2">
                          {partenaire.nom}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isMobile && (
                <div className="flex justify-center mt-4 space-x-2">
                  {categorie.partenaires.slice(0, Math.ceil(categorie.partenaires.length / 3)).map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() => scrollToIndex(index, dotIndex)}
                      className="w-2 h-2 rounded-full bg-gray-300 hover:bg-[#146C2D] transition-colors duration-300"
                      aria-label={`الانتقال إلى الشريحة ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* VERTICAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {normalCategories.map((categorie, categoryIndex) => (
            <div
              key={categorie.id}
              className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                  <div className="mb-3 sm:mb-4 lg:mb-5 flex justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#146C2D] text-white font-semibold rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300 border border-white text-sm sm:text-base lg:text-lg">
                      {categoryIndex + 1}
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-[#146C2D] mb-2 sm:mb-3">
                    {categorie.titre}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm lg:text-base font-light max-w-md mx-auto">
                    {categorie.description}
                  </p>
                </div>
                <div className="max-h-48 sm:max-h-60 lg:max-h-80 overflow-y-auto pr-2 sm:pr-3 custom-scrollbar space-y-2 sm:space-y-3">
                  {categorie.partenaires.map((partenaire, index) => {
                    const imageKey = `${categorie.id}-${partenaire.id}`;
                    return (
                      <div
                        key={index}
                        className="flex items-center p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl bg-gray-25 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-emerald-100 group/item"
                      >
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-white shadow-sm flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 group-hover/item:scale-105 sm:group-hover/item:scale-110 transition-transform duration-300 border">
                          {partenaire.logo ? (
                            <img
                              src={partenaire.logo}
                              alt={partenaire.nom}
                              loading="lazy"
                              onLoad={() => handleImageLoad(imageKey)}
                              className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 object-contain filter grayscale group-hover/item:grayscale-0 transition-all duration-300 ${
                                imagesLoaded[imageKey] ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          ) : (
                            <span className="text-xs sm:text-sm font-bold text-gray-500">
                              {partenaire.nom.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-700 font-medium line-clamp-1">
                          {partenaire.nom}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CALL TO ACTION */}
        <div className="bg-gradient-to-b from-[#D59B49] to-[#E6C698]  rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-white shadow-lg">
          <h3 className="text-3xl font-bold text-white mb-4">
            Rejoignez notre réseau de partenaires
          </h3>
          <p className="text-sm sm:text-base lg:text-lg font-light mb-4 sm:mb-6 text-gray-900">
            Collaborez avec nous pour un impact durable et des projets innovants
          </p>
          <button className="px-8 py-4 text-white bg-[#146C2D] font-bold rounded-xl hover:bg-[#0a3d19] transition-colors duration-300">
            Contactez-nous
          </button>
        </div>
      </div>
    </section>
  );
};

export default Partenairetype;
