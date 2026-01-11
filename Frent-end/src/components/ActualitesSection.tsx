import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight, Clock } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

type Actualite = {
  id: number;
  titre: string;
  slug: string;
  resume: string;
  image?: string;
  categorie?: string;
  date_publication?: string;
  temps_lecture?: number;
};

/* Skeleton Loader */
const ActualiteSkeleton = () => (
  <div className="flex flex-col lg:flex-row bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="lg:w-80 h-56 bg-gray-200" />
    <div className="flex-1 p-8 space-y-4">
      <div className="h-4 w-40 bg-gray-200 rounded" />
      <div className="h-6 w-3/4 bg-gray-200 rounded" />
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-5/6 bg-gray-200 rounded" />
    </div>
  </div>
);

const ActualitesSection: React.FC = () => {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);

  const articlesRef = useRef<HTMLElement[]>([]);

  /* Fetch data */
  useEffect(() => {
    const fetchActualites = async () => {
      try {
        const res = await axios.get<Actualite[]>(`${API_URL}/api/actualites`);
        const sorted = [...res.data]
          .sort(
            (a, b) =>
              new Date(b.date_publication || "").getTime() -
              new Date(a.date_publication || "").getTime()
          )
          .slice(0, 4);

        setActualites(sorted);
      } catch (err) {
        console.error("Erreur chargement actualités", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActualites();
  }, []);

  /* IntersectionObserver + animation */
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const index = articlesRef.current.findIndex(a => a === el);

            // Apply Tailwind animation class based on index
            if (index % 2 === 0) {
              el.classList.add("animate-fade-slide-left");
            } else {
              el.classList.add("animate-fade-slide-right");
            }

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );

    articlesRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!loading && actualites.length === 0) return null;

  return (
    <section className="py-20 bg-[#F9F6F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#146C2D] rounded-full mb-4 sm:mb-6 shadow-md shadow-emerald-100">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white rounded-full mr-2 sm:mr-3 animate-pulse"></span>
            <span className="text-white font-medium text-xs sm:text-sm uppercase tracking-wider">
              Dernières actualité
            </span>
          </div>
          <div className="w-20 sm:w-24 lg:w-32 h-1 bg-[#146C2D] mx-auto mb-6 sm:mb-8 rounded-full shadow-sm"></div>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Suivez nos communiqués, événements et informations officielles
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-8">
          {loading && [1, 2, 3].map(i => <ActualiteSkeleton key={i} />)}

          {!loading &&
            actualites.map((act, index) => (
              <article
                key={act.id}
                ref={el => (articlesRef.current[index] = el)}
                className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden opacity-0"
              >
                {/* Accent bar */}
                <div className="absolute left-0 top-0 h-full w-1 bg-[#146C2D]
                  scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

                {/* Badge À la une */}
                {index === 0 && (
                  <span className="absolute top-4 right-4 z-10 px-4 py-1 text-xs font-bold uppercase tracking-wider
                    bg-[#146C2D] text-white rounded-full">
                    À la une
                  </span>
                )}

                <Link to={`/actualites/${act.slug}`} className="flex flex-col lg:flex-row">
                  {/* IMAGE */}
                  <div className="relative lg:w-80 h-56 lg:h-auto overflow-hidden">
                    {act.image ? (
                      <img
                        src={`${API_URL}/uploads/actualites/${act.image}`}
                        alt={act.titre}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#146C2D] to-[#0a3d19]
                        flex items-center justify-center">
                        <span className="text-white font-semibold tracking-wide">ACTUALITÉ</span>
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      {/* META */}
                      <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-4">
                        {act.date_publication && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4 text-[#146C2D]" />
                            {formatDate(act.date_publication)}
                          </span>
                        )}
                        {act.temps_lecture && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-[#146C2D]" />
                            {act.temps_lecture} min
                          </span>
                        )}
                        {act.categorie && (
                          <span className="px-3 py-1 rounded-full bg-[#146C2D]/10 text-[#146C2D] font-semibold">
                            {act.categorie}
                          </span>
                        )}
                      </div>

                      {/* TITLE */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-snug
                        group-hover:text-[#146C2D] transition-colors">
                        {act.titre}
                      </h3>

                      {/* RESUME */}
                      <p className="text-gray-600 leading-relaxed line-clamp-3">{act.resume}</p>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 flex items-center text-[#146C2D] font-semibold">
                      Lire l’article
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
        </div>

        {/* CTA ALL */}
        <div className="text-center mt-14">
          <Link
            to="/actualites"
            className="inline-flex items-center px-8 py-4 bg-[#146C2D] text-white font-bold
              rounded-xl hover:bg-[#0a3d19] transition-all hover:scale-105 hover:shadow-xl"
          >
            Voir toutes les actualités
            <ArrowRight className="w-5 h-5 ml-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ActualitesSection;
