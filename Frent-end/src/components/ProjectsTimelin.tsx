import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/* ================= TYPES ================= */
type Project = {
  id: number;
  titre: string;
  date_deb: string;
  categorie?: string;
};

/* ================= COMPONENT ================= */
const ProjectsTimeline = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [selectedYearProjects, setSelectedYearProjects] = useState<Project[]>([]);
  const [animateKey, setAnimateKey] = useState(0);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    axios
      .get<Project[]>(`${API_URL}/api/projects`)
      .then((res) => {
        setProjects(res.data);

        if (res.data.length > 0) {
          const latestYear = Math.max(
            ...res.data.map((p) => new Date(p.date_deb).getFullYear())
          );
          setActiveYear(latestYear);
          setSelectedYearProjects(
            res.data.filter(
              (p) => new Date(p.date_deb).getFullYear() === latestYear
            )
          );
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  /* ================= GROUP BY YEAR ================= */
  const projectsByYear = projects.reduce((acc, project) => {
    const year = new Date(project.date_deb).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(project);
    return acc;
  }, {} as Record<number, Project[]>);

  const sortedYears = Object.keys(projectsByYear)
    .map(Number)
    .sort((a, b) => a - b); // ✅ من الصغير للكبير

  /* ================= HANDLE YEAR CLICK ================= */
 const handleYearClick = (year: number) => {
  setActiveYear(year);
  setSelectedYearProjects(projectsByYear[year] || []);
  setAnimateKey((prev) => prev + 1);
};


  /* ================= LOADING ================= */
  if (loading) {
    return (
      <section className="py-16 text-center">
        <div className="w-14 h-14 mx-auto border-4 border-[#E2B16C]/30 border-t-[#E2B16C] rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Chargement...</p>
      </section>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-16">Erreur serveur</div>;
  }

  /* ================= RENDER ================= */
  return (
    <section className="bg-[#F9F6F0] py-16">
  <div className="max-w-6xl mx-auto px-4">

    {/* TITLE */}
    <div className="text-center mb-16">
      <div className="inline-flex items-center px-4 py-2 bg-[#146C2D] rounded-full mb-4 shadow-md">
        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
        <span className="text-white font-medium text-sm uppercase tracking-wider">
          Notre Histoire
        </span>
      </div>
      <div className="w-24 h-1 bg-[#146C2D] mx-auto rounded-full shadow-sm"></div>
    </div>

    {/* TIMELINE */}
    <div className="relative mb-12">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2"></div>
      <div className="relative flex justify-between z-10">
        {sortedYears.map((year) => (
          <button
            key={year}
            onClick={() => handleYearClick(year)}
            className={`z-10 w-12 h-12 rounded-full font-bold transition-transform duration-300
              ${activeYear === year
                ? "bg-[#E2B16C] text-white scale-110 shadow-lg"
                : "bg-white text-gray-700 shadow hover:scale-105 hover:bg-[#F5C98C]/20"
              }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>

    {/* PROJECTS LIST */}
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-[#E2B16C] px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-[#146C2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Année <span className="text-[#146C2D]">{activeYear}</span>
              </h3>
              <span className="px-2 py-1 bg-[#146C2D]/10 text-white text-xs font-medium rounded-full">
                {selectedYearProjects.length} projet{selectedYearProjects.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 md:p-6">
        <div key={animateKey} className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-projects">
          {selectedYearProjects.map((project, index) => (
            <Link
              key={project.id}
              to={`/projet/${project.id}`}
              className="group relative overflow-hidden bg-gradient-to-br from-white to-[#F9FCFA] rounded-xl p-5 border border-gray-200 hover:border-[#E2B16C]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative flex items-start gap-4">
                {/* Badge */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E2B16C] to-[#F5C98C] flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 group-hover:text-[#146C2D] transition-colors line-clamp-2 mb-2">
                    {project.titre}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(project.date_deb).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>

    <style>{`
      @keyframes projectsFade {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-projects { animation: projectsFade 0.45s ease-out; }
    `}</style>
  </div>
</section>

  );
};

export default ProjectsTimeline;
