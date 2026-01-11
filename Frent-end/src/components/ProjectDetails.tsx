import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  FileText,
  Image as ImageIcon,
  Globe,
  Award,
  BarChart3,
  ChevronRight,
  TrendingUp,
  MapPin,
  Target,
  DollarSign,
  Mail,
  Phone,
} from "lucide-react";

import ProjectGallery from "./ProjectGallery";

// ===================== TYPES =====================
interface Project {
  id: number;
  titre: string;
  description: string;
  partenaire: string;
  date_deb: string;
  date_fin?: string;
  statut: "en_cours" | "termine";
  domain_id: number;
  domain_nom?: string;
  budget?: number;
  location?: string;
  impact_metrics?: string;
  contact_email?: string;
  contact_phone?: string;
}

interface Domain {
  id: number;
  nom: string;
  description?: string;
}

interface GalleryImage {
  id: number;
  image: string;
  caption?: string;
  date_taken?: string;
}

// ===================== CONSTANTS =====================
const API_URL = import.meta.env.VITE_API_URL;

// ===================== MAIN COMPONENT =====================
const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===================== EFFECTS =====================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [projectRes, galleryRes, domainRes] = await Promise.all([
          fetch(`${API_URL}/api/projects/${id}`),
          fetch(`${API_URL}/api/gallery/project/${id}`),
          fetch(`${API_URL}/api/domain`),
        ]);

        if (!projectRes.ok) throw new Error("Projet non trouvé");
        if (!galleryRes.ok) console.warn("Galerie non disponible");
        if (!domainRes.ok) console.warn("Domaines non disponibles");

        const [projectData, galleryData, domainData] = await Promise.all([
          projectRes.json(),
          galleryRes.ok ? galleryRes.json() : [],
          domainRes.ok ? domainRes.json() : [],
        ]);

        setProject(projectData);
        setGalleryImages(galleryData);
        setDomains(domainData);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // ===================== UTILITIES =====================
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const getDomainName = (domainId: number) => {
    const domain = domains.find(d => d.id === domainId);
    return domain ? domain.nom : "Non défini";
  };

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      en_cours: {
        text: "En cours",
        color: "bg-emerald-100 text-emerald-800",
        borderColor: "border-emerald-300",
        icon: <Clock className="w-4 h-4" />,
      },
      termine: {
        text: "Terminé",
        color: "bg-blue-100 text-blue-800",
        borderColor: "border-blue-300",
        icon: <CheckCircle className="w-4 h-4" />,
      },
    };

    return statusConfig[status as keyof typeof statusConfig] || {
      text: "Non défini",
      color: "bg-gray-100 text-gray-800",
      borderColor: "border-gray-300",
      icon: <Clock className="w-4 h-4" />,
    };
  };

  const getDomainIcon = (domainId: number) => {
    const icons = {
      1: { icon: <Globe className="w-5 h-5" />, color: "text-emerald-600" },
      2: { icon: <FileText className="w-5 h-5" />, color: "text-amber-600" },
      3: { icon: <BarChart3 className="w-5 h-5" />, color: "text-purple-600" },
      default: { icon: <Award className="w-5 h-5" />, color: "text-gray-600" },
    };

    const { icon, color } = icons[domainId as keyof typeof icons] || icons.default;
    return React.cloneElement(icon, { className: `${icon.props.className} ${color}` });
  };

  const formatBudget = (budget?: number) => {
    if (!budget) return "Budget non spécifié";
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget);
  };

  // ===================== LOADING STATE =====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Chargement du projet...</p>
          <p className="mt-2 text-sm text-gray-500">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  // ===================== ERROR STATE =====================
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="w-24 h-24 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6">
            <ArrowLeft className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Projet introuvable</h2>
          <p className="text-gray-600 mb-8">
            {error || "Le projet que vous recherchez n'existe pas ou a été déplacé."}
          </p>
          <button
            onClick={() => navigate("/projets")}
            className="inline-flex items-center gap-3 px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux projets
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(project.statut);

  // ===================== RENDER =====================
  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      {/* Header avec navigation */}
      <header className="bg-gradient-to-b from-[#D59B49] to-[#E6C698] border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <button
              onClick={() => navigate("/projets")}
              className="inline-flex items-center gap-2 text-white hover:text-emerald-900 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Retour aux projets</span>
            </button>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.color} border ${statusInfo.borderColor} inline-flex items-center gap-2 shadow-sm`}>
                {statusInfo.icon}
                {statusInfo.text}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                {project.domain_nom || getDomainName(project.domain_id)}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#146C2D]  leading-tight">
              {project.titre}
            </h1>
            {project.partenaire && (
              <p className="mt-4 text-lg text-gray-700">
                En partenariat avec : <span className="font-bold text-emerald-700">{project.partenaire}</span>
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Contenu principal */}
          <div className="lg:col-span-2 space-y-8 ">
            {/* Galerie photos */}
            {galleryImages.length > 0 && (
              <section className=" rounded-2xl border border-gray-200 shadow-sm overflow-hidden ">
                <div className="p-6 border-b border-gray-100 bg-[#e2b16c] ">
                  <div className="flex items-center justify-between  ">
                    <div className="flex items-center gap-4 ">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Galerie du projet
                        </h2>
                        <p className="text-white">
                          {galleryImages.length} photo{galleryImages.length > 1 ? 's' : ''} documentant le projet
                        </p>
                      </div>
                    </div>
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-emerald-800">
                      {galleryImages.length}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <ProjectGallery
                    images={galleryImages}
                    apiUrl={API_URL}
                    projectTitle={project.titre}
                  />
                </div>
              </section>
            )}

            {/* Description du projet */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-[#e2b16c]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Présentation générale du projet
                    </h2>
                    <p className="text-white mt-1">
                      Objectifs, mise en œuvre et réalisations
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 prose prose-lg max-w-none">
                {project.description.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          </div>

          {/* Colonne droite - Informations latérales */}
          <div className="space-y-8">
            {/* Détails du projet */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#F9F6F0] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Détails du projet</h3>
              </div>

              <div className="space-y-6">
                <DetailItem
                  icon={<Calendar className="w-5 h-5" />}
                  label="Date de début"
                  value={formatDate(project.date_deb)}
                  color="text-emerald-600"
                />

                <DetailItem
                  icon={project.date_fin ? 
                    <CheckCircle className="w-5 h-5" /> : 
                    <Clock className="w-5 h-5" />}
                  label={project.date_fin ? "Date de fin" : "Statut"}
                  value={project.date_fin ? formatDate(project.date_fin) : "En cours"}
                  color={project.date_fin ? "text-blue-600" : "text-amber-600"}
                />

                <DetailItem
                  icon={<Users className="w-5 h-5" />}
                  label="Partenaire"
                  value={project.partenaire}
                  color="text-purple-600"
                />

              </div>
            </section>

            {/* Domaine d'activité */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#F9F6F0]  flex items-center justify-center">
                  {getDomainIcon(project.domain_id)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Domaine d'activité</h3>
                  <p className="text-gray-600 mt-1">Secteur principal</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-emerald-200 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg text-gray-900">
                      {project.domain_nom || getDomainName(project.domain_id)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Classification du projet</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </section>
            </div>
        </div>
      </main>

      {/* Section d'appel à l'action */}
      <footer className="container mx-auto px-4 pb-12 pt-8">
        <div className="bg-gradient-to-b from-[#D59B49] to-[#E6C698]  border border-emerald-100 rounded-2xl p-10 text-center shadow-lg">
          <h3 className="text-3xl font-bold text-white mb-4">
            Intéressé par ce projet ?
          </h3>
          <p className="text-gray-900 mb-8 max-w-2xl mx-auto text-lg">
            Contactez-nous pour plus d'informations, des visites de terrain,
            ou pour discuter de collaborations futures.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => navigate("/contact ")}
              className="px-8 py-4 text-white bg-[#146C2D] font-bold rounded-xl hover:bg-[#0a3d19] transition-colors duration-300">
              Contactez l'équipe projet
            </button>
            <button
              onClick={() => navigate("/projets")}
              className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Découvrir tous nos projets
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ===================== COMPONENTS =====================
interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, color = "text-gray-700" }) => (
  <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 ${color}`}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default ProjectDetails;