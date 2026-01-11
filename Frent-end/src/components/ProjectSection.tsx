import React, { useState, useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/* ======================
   Interfaces
====================== */
interface Project {
  id: number;
  titre: string;
  photo?: string;
  slug?: string;
  date_deb?: string;
  statut: "en_cours" | "termine";
  domain_id: number;
}

interface Domain {
  id: number;
  nom: string;
}

/* ======================
   📅 Date formatter
====================== */
const formatDate = (date?: string) => {
  if (!date) return "—";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

const CustomSlider = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  /* ======================
     📡 Fetch projects + domains
  ====================== */
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/projects`).then(r => r.json()),
      fetch(`${API_URL}/api/domain`).then(r => r.json()),
    ])
      .then(([data, d]) => {
        const enCours = data
          .filter((p: Project) => p.statut === "en_cours")
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);

        setProjects(enCours);
        setDomains(d);
      })
      .catch(err => console.error("❌ Fetch error:", err));
  }, []);

  /* ======================
     🔁 Auto slide (اختياري)
  ====================== */
  useEffect(() => {
    if (projects.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [projects.length]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev =>
      prev === 0 ? projects.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const getDomainName = (domainId: number) => {
    const d = domains.find(d => d.id === domainId);
    return d ? d.nom : "—";
  };

  if (projects.length === 0) return null;

  return (
    <section className="relative py-16 lg:py-20 bg-[#F9F6F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* HEADER */}
              <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#146C2D] rounded-full mb-4 sm:mb-6 shadow-md shadow-emerald-100">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white rounded-full mr-2 sm:mr-3 animate-pulse"></span>
            <span className="text-white font-medium text-xs sm:text-sm uppercase tracking-wider">
              Projets en cours
            </span>
          </div>
          <div className="w-20 sm:w-24 lg:w-32 h-1 bg-[#146C2D] mx-auto mb-6 sm:mb-8 rounded-full shadow-sm"></div>
           <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Explorez l’ensemble de nos projets en cours et découvrez comment nous œuvrons pour le développement local et durable.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <LazyCard
              key={project.id}
              project={project}
              index={index}
              getDomainName={getDomainName}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default CustomSlider;

/* ===================================================
   🔹 Lazy Card
=================================================== */

const LazyCard = ({
  project,
  index,
  getDomainName,
}: {
  project: Project;
  index: number;
  getDomainName: (id: number) => string;
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <article
  ref={ref}
  onClick={() =>
    window.location.href = project.slug
      ? `/Activites/${project.slug}`
      : `/projet/${project.id}`
  }
  className={`
    relative cursor-pointer group bg-white rounded-2xl overflow-hidden
    border border-gray-100 shadow-md
    transition-all duration-700 ease-out
    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
    hover:-translate-y-2 hover:shadow-2xl
  `}
>
  {/* IMAGE */}
  <div className="relative h-52 lg:h-60 overflow-hidden rounded-t-2xl">
    {visible ? (
      <img
        src={project.photo ? `${API_URL}${project.photo}` : "/placeholder.jpg"}
        alt={project.titre}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    ) : (
      <div className="w-full h-full bg-gray-200 animate-pulse" />
    )}

    {/* Overlay خفيف */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

   
  </div>

  {/* CONTENT */}
  <div className="p-6 flex flex-col justify-between h-[220px]">
    <div>
      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 leading-snug
        group-hover:text-[#146C2D] transition-colors line-clamp-2">
        {project.titre}
      </h3>

      <div className="space-y-2 text-sm text-gray-600">
        <div>
          <span className="font-semibold text-[#146C2D]">Domaine :</span>{" "}
          {getDomainName(project.domain_id)}
        </div>

        <div>
          <span className="font-semibold text-[#146C2D]">Date début :</span>{" "}
          {formatDate(project.date_deb)}
        </div>
      </div>
    </div>

    {/* CTA */}
    <div className="mt-4 flex items-center justify-between">
      <span className="text-[#146C2D] font-semibold text-sm tracking-wide">
        Découvrir le projet
      </span>
      <span className="w-8 h-8 rounded-full border border-[#146C2D]
        flex items-center justify-center
        transition-all duration-300
        group-hover:bg-[#146C2D] group-hover:text-white">
        →
      </span>
    </div>
  </div>

  {/* Bottom Accent */}
  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#D59B49]
    scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
</article>

  );
};

