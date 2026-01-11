import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ArrowRight,
  FileText,
  Layers,
  CalendarCheck,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

type Actualite = {
  id: number;
  titre: string;
  slug: string;
  resume: string;
  contenu: string;
  image?: string;
  categorie?: string;
  date_publication?: string;
};

const ActualitesContent: React.FC = () => {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategorie, setSelectedCategorie] = useState("all");

  /* ================= REFS ================= */
  const articlesRef = useRef<HTMLElement[]>([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchActualites = async () => {
      try {
        const res = await axios.get<Actualite[]>(`${API_URL}/api/actualites`);
        setActualites(res.data);
      } catch {
        setError("Impossible de charger les actualités.");
      } finally {
        setLoading(false);
      }
    };

    fetchActualites();
  }, []);

  /* ================= FILTER ================= */
  const filteredActualites = useMemo(() => {
    if (selectedCategorie === "all") return actualites;
    return actualites.filter(a => a.categorie === selectedCategorie);
  }, [actualites, selectedCategorie]);

  /* ================= RESET REFS ================= */
  articlesRef.current = [];

  /* ================= SCROLL ANIMATION ================= */
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    articlesRef.current.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, filteredActualites]);

  /* ================= HELPERS ================= */
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  /* ================= CATEGORIES ================= */
  const categories = useMemo(() => {
    const cats = actualites.map(a => a.categorie).filter(Boolean) as string[];
    return ["all", ...Array.from(new Set(cats))];
  }, [actualites]);

  /* ================= STATS ================= */
  const totalActualites = filteredActualites.length;

  const totalCategories = useMemo(() => {
    const cats = filteredActualites.map(a => a.categorie).filter(Boolean);
    return new Set(cats).size;
  }, [filteredActualites]);

  const latestActualite = useMemo(() => {
    if (!filteredActualites.length) return null;
    return [...filteredActualites].sort(
      (a, b) =>
        new Date(b.date_publication || "").getTime() -
        new Date(a.date_publication || "").getTime()
    )[0];
  }, [filteredActualites]);

  /* ================= STATES ================= */
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#146C2D] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <section className="bg-[#F9F6F0] py-16 overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-5 py-2.5 bg-[#146C2D] rounded-full mb-6 shadow-md">
          <span className="w-2.5 h-2.5 bg-white rounded-full mr-3 animate-pulse" />
          <span className="text-white font-medium text-sm uppercase tracking-wider">
            ACTUALITÉS & ÉVÉNEMENTS
          </span>
        </div>
        <div className="w-24 h-1 bg-[#146C2D] mx-auto rounded-full" />
      </div>

      {/* ================= STATS ================= */}
      <div className="max-w-7xl mx-auto px-4 mb-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: FileText, label: "Total des actualités", value: totalActualites },
          { icon: Layers, label: "Catégories", value: totalCategories },
          {
            icon: CalendarCheck,
            label: "Dernière publication",
            value: latestActualite?.date_publication
              ? formatDate(latestActualite.date_publication)
              : "—",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 text-center shadow-lg"
          >
            <stat.icon className="w-6 h-6 mx-auto mb-2 text-[#146C2D]" />
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="font-bold text-xl text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ================= FILTER ================= */}
      <div className="max-w-7xl mx-auto px-4 mb-10 flex justify-end">
        <select
          value={selectedCategorie}
          onChange={e => setSelectedCategorie(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 bg-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Toutes les catégories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* ================= LIST ================= */}
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {filteredActualites.map((act, index) => (
          <article
            key={act.id}
            ref={el => {
              if (el) articlesRef.current.push(el);
            }}
            className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden
              opacity-0 transition-all duration-500 hover:shadow-xl
              ${index % 2 === 0 ? "-translate-x-20" : "translate-x-20"}`}
          >
            <Link to={`/actualites/${act.slug}`} className="flex flex-col lg:flex-row">
              {/* IMAGE */}
              <div className="lg:w-72 h-56 overflow-hidden">
                {act.image ? (
                  <img
                    src={`${API_URL}/uploads/actualites/${act.image}`}
                    alt={act.titre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#146C2D] to-[#0a3d19]" />
                )}
              </div>

              {/* CONTENT */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  {act.date_publication && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <CalendarDays className="w-4 h-4 mr-2 text-[#146C2D]" />
                      {formatDate(act.date_publication)}
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#146C2D]">
                    {act.titre}
                  </h3>

                  <p className="text-gray-600 line-clamp-3">{act.resume}</p>
                </div>

                <span className="mt-4 inline-flex items-center text-[#146C2D] font-semibold">
                  Lire l’article
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ActualitesContent;
