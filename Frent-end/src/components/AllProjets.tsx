import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Users,
  Target,
  Clock,
  CheckCircle,
  PlayCircle,
  Search,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  titre: string;
  description: string;
  partenaire: string;
  date_deb: string;
  date_fin?: string;
  statut: "en_cours" | "termine";
  domain_id: number;
  photo?: string;
}

interface Domain {
  id: number;
  nom: string;
}

const API_URL = import.meta.env.VITE_API_URL;


export default function AllProjets() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  const [domain, setDomain] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/projects`).then(r => r.json()),
      fetch(`${API_URL}/api/domain`).then(r => r.json()),
    ])
      .then(([p, d]) => {
        setProjects(p);
        setDomains(d);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (domain !== "all" && p.domain_id.toString() !== domain) return false;
      if (status !== "all" && p.statut !== status) return false;
      if (search && !p.titre.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [projects, domain, status, search]);

  const statusStyle = {
    en_cours: "bg-[#E8F5E9] text-[#146C2D] border border-[#146C2D]/30",
    termine: "bg-[#E3F2FD] text-[#1565C0] border border-[#1565C0]/30",
  };

  const statusIcon = {
    en_cours: <PlayCircle size={14} className="text-[#146C2D]" />,
    termine: <CheckCircle size={14} className="text-[#1565C0]" />,
  };

  const stats = useMemo(() => {
    const total = projects.length;
    const en_cours = projects.filter(p => p.statut === "en_cours").length;
    const termine = projects.filter(p => p.statut === "termine").length;

    return { total, en_cours, termine };
  }, [projects]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#F5FCF8]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#146C2D]"></div>
          <p className="mt-4 text-gray-600">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  const getDomainName = (domainId: number) => {
    const d = domains.find(d => d.id === domainId);
    return d ? d.nom : "Non défini";
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Date non spécifiée";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <section className="min-h-screen bg-[#F9F6F0] py-8 md:py-12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="mb-10 md:mb-12">
          {/* HEADER */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#146C2D] rounded-full mb-4 sm:mb-6 shadow-md shadow-emerald-100">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white rounded-full mr-2 sm:mr-3 animate-pulse"></span>
              <span className="text-white font-medium text-xs sm:text-sm uppercase tracking-wider">
                Projets & Réalisations
              </span>
            </div>
            <div className="w-20 sm:w-24 lg:w-32 h-1 bg-[#146C2D] mx-auto mb-6 sm:mb-8 rounded-full shadow-sm"></div>
          </div>


          {/* STATS CARDS */}
          <div className="max-w-7xl mx-auto px-4 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Total projets */}
              <div className="group bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-[#146C2D]/10">
                  <Target className="w-6 h-6 text-[#146C2D]" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Total projets</p>
                <p className="text-3xl font-bold text-[#146C2D]">
                  {stats.total}
                </p>
              </div>

              {/* En cours */}
              <div className="group bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-[#1565C0]/10">
                  <PlayCircle className="w-6 h-6 text-[#1565C0]" />
                </div>
                <p className="text-sm text-gray-500 mb-1">En cours</p>
                <p className="text-3xl font-bold text-[#1565C0]">
                  {stats.en_cours}
                </p>
              </div>

              {/* Terminés */}
              <div className="group bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-[#D59B49]/10">
                  <CheckCircle className="w-6 h-6 text-[#D59B49]" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Terminés</p>
                <p className="text-3xl font-bold text-[#D59B49]">
                  {stats.termine}
                </p>
              </div>

              {/* Domaines */}
              <div className="group bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-[#0056A8]/10">
                  <Users className="w-6 h-6 text-[#0056A8]" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Domaines</p>
                <p className="text-3xl font-bold text-[#0056A8]">
                  {domains.length}
                </p>
              </div>

            </div>
          </div>

          {/* FILTERS SECTION */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-12 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Filtrer les projets
            </h2>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <select
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146C2D]/30 focus:border-[#146C2D] bg-white "
                >
                  <option value="all">Tous les domaines</option>
                  {domains.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.nom}
                    </option>
                  ))}
                </select>

                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146C2D]/30 focus:border-[#146C2D] bg-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                </select>
              </div>

              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un projet par titre..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146C2D]/30 focus:border-[#146C2D]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PROJECTS GRID - VERSION SIMPLIFIÉE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(p => (
            <div
              key={p.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#146C2D]/20 hover:-translate-y-1
             flex flex-col h-full"
            >
              {/* IMAGE DU PROJET AVEC OVERLAY */}
              {p.photo ? (
                <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={`${API_URL}${p.photo}`}
                    alt={p.titre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                  {/* Status badge on image */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm ${statusStyle[p.statut]}`}
                    >
                      {statusIcon[p.statut]}
                      <span className="capitalize">{p.statut.replace("_", " ")}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-52 w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Target size={48} className="text-gray-300" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <div
                      className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm ${statusStyle[p.statut]}`}
                    >
                      {statusIcon[p.statut]}
                      <span className="capitalize">{p.statut.replace("_", " ")}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Domain tag */}
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#146c2d] "></div>
                  <span className="text-xs font-semibold text-[#146C2D] group-hover:text-black transition-colors uppercase tracking-wider">
                    {getDomainName(p.domain_id)}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-[#146C2D] transition-colors">
                  {p.titre}
                </h3>

                {/* Project Details */}
                <div className="space-y-3 mb-6 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 flex-1">
                      <div className="p-1.5 bg-gray-50 rounded-lg">
                        <Calendar size={14} className="text-gray-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Début</span>
                        <span className="font-medium text-gray-800">{formatDate(p.date_deb)}</span>
                      </div>
                    </div>

                    {p.date_fin && (
                      <div className="flex items-center gap-2 text-gray-600 flex-1">
                        <div className="p-1.5 bg-gray-50 rounded-lg">
                          <Clock size={14} className="text-gray-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Fin</span>
                          <span className="font-medium text-gray-800">{formatDate(p.date_fin)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 flex-1">
                      <div className="p-1.5 bg-gray-50 rounded-lg">
                        <Users size={14} className="text-gray-500" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-gray-500">Partenaire</span>
                        <span className="font-medium text-gray-800 truncate">
                          {p.partenaire || "Non spécifié"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/projet/${p.id}`)}
                  className="mt-auto w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#146C2D] to-[#115926] text-white font-semibold hover:shadow-lg hover:from-[#115926] hover:to-[#0a3d19] transition-all duration-300 group/btn"
                >
                  <span>Voir les détails</span>
                  <Eye size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun projet trouvé
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Aucun projet ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
            </p>
            <button
              onClick={() => {
                setDomain("all");
                setStatus("all");
                setSearch("");
              }}
              className="px-6 py-2.5 bg-[#146C2D] text-white rounded-lg hover:bg-[#115926] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </section>
  );
}