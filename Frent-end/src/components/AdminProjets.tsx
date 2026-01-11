import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Projet, Domaine } from '../types/gallery.types';
import { GalleryModal } from './GalleryModal';
import { FiEdit, FiTrash2, FiImage, FiPlus, FiCalendar, FiFolder, FiTag, FiCheck, FiX, FiEye, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { DeleteModal } from './DeleteModal';
import { Layers } from 'lucide-react';

const AdminProjets = () => {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // حالة جديدة لعرض المشاريع بشكل مقتصر
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(5); // عدد المشاريع المعروضة أولاً

  const [formData, setFormData] = useState({
    domain_id: '',
    titre: '',
    description: '',
    partenaire: '',
    date_deb: '',
    date_fin: '',
    statut: 'en_cours',
    photo: null as File | null
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{ id: number, titre: string } | null>(null);



  const API_URL = import.meta.env.VITE_API_URL;
  const PROJETS_URL = `${API_URL}/api/projects`;
  const DOMAINES_URL = `${API_URL}/api/domain`;

  useEffect(() => {
    fetchProjets();
    fetchDomaines();
  }, []);

  const fetchProjets = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Projet[]>(PROJETS_URL);
      setProjets(response.data);
      setError('');
    } catch (err) {
      setError("Erreur lors du chargement des projets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDomaines = async () => {
    try {
      const response = await axios.get<Domaine[]>(DOMAINES_URL);
      setDomaines(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des domaines', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === 'photo') {
      setFormData(prev => ({ ...prev, photo: files[0] || null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      domain_id: '',
      titre: '',
      description: '',
      partenaire: '',
      date_deb: '',
      date_fin: '',
      statut: 'en_cours',
      photo: null
    });
    setEditingId(null);
    setSuccess('');
    setShowForm(false); // إغلاق النموذج عند الإلغاء
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre || !formData.domain_id) {
      setError('Le titre et le domaine sont obligatoires');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'photo') {
          if (value) {
            data.append('photo', value as any);
          } else if (editingId) {
            const oldProject = projets.find(p => p.id === editingId);
            if (oldProject?.photo) {
              data.append('photo', oldProject.photo as any);
            }
          }
        } else {
          if (value !== null && value !== '') {
            data.append(key, value as any);
          }
        }
      });

      if (editingId) {
        await axios.put(`${PROJETS_URL}/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Projet mis à jour avec succès');
      } else {
        await axios.post(PROJETS_URL, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Projet créé avec succès');
      }

      resetForm();
      fetchProjets();

      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (projet: Projet) => {
    setFormData({
      domain_id: String(projet.domain_id),
      titre: projet.titre,
      description: projet.description || '',
      partenaire: projet.partenaire || '',
      date_deb: projet.date_deb ? projet.date_deb.split('T')[0] : '',
      date_fin: projet.date_fin ? projet.date_fin.split('T')[0] : '',
      statut: projet.statut,
      photo: null
    });
    setEditingId(projet.id);
    setShowForm(true); // فتح النموذج عند التعديل
    setSuccess('');

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id: number) => {

    try {
      setLoading(true);
      await axios.delete(`${PROJETS_URL}/${id}`);
      fetchProjets();
      setSuccess('Projet supprimé avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGallery = (projet: Projet) => {
    setSelectedProject({ id: projet.id, titre: projet.titre });
    setShowGalleryModal(true);
  };

  // دالة لفتح نموذج إنشاء مشروع جديد
  const handleNewProjectClick = () => {
    resetForm(); // إعادة تعيين النموذج
    setShowForm(true); // فتح النموذج
    setEditingId(null); // التأكد من أننا في وضع الإنشاء

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // دالة لعرض المزيد من المشاريع
  const handleShowMore = () => {
    if (showAllProjects) {
      setShowAllProjects(false);
    } else {
      setShowAllProjects(true);
    }
  };

  // المشاريع المعروضة بناءً على الحالة
  const displayedProjects = showAllProjects
    ? projets
    : projets.slice(0, visibleProjectsCount);

  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('fr-FR') : 'Non définie';

  const getStatusBadge = (statut: string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      'en_cours': {
        label: 'En cours',
        color: 'bg-amber-50 text-amber-700 border border-amber-200',
        icon: <FiCalendar className="mr-1" size={14} />
      },
      'termine': {
        label: 'Terminé',
        color: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        icon: <FiCheck className="mr-1" size={14} />
      },
    };
    const config = statusConfig[statut] || {
      label: statut,
      color: 'bg-gray-50 text-gray-700 border border-gray-200',
      icon: null
    };
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] p-4 md:p-6 lg:p-8 text-black ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#1E6B24] shadow-lg">
                <Layers className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Projets</h1>
                <p className="text-gray-600 mt-1">Gérez et organisez vos projets efficacement</p>
              </div>
            </div>

            {/* زر Nouveau Projet في الـ Header */}
            <button
              onClick={handleNewProjectClick}
              className="px-6 py-3 bg-[#1E6B24] hover:bg-[#0a3d19]  text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FiPlus size={20} />
              Nouveau Projet
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <FiX className="text-red-600" size={20} />
              </div>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <FiX size={20} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl shadow-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <FiCheck className="text-emerald-600" size={20} />
              </div>
              <span className="text-emerald-700 font-medium">{success}</span>
            </div>
            <button onClick={() => setSuccess('')} className="text-emerald-500  hover:text-emerald-700">
              <FiX size={20} />
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  {/* Total Projets */}
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Total Projets</p>
        <p className="text-2xl font-bold text-gray-900">{projets.length}</p>
      </div>
      <div className="p-2 rounded-lg bg-[#F9F6F0]">
        <Layers className="text-[#1E6B24]" size={24} />
      </div>
    </div>
  </div>

  {/* En cours */}
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">En cours</p>
        <p className="text-2xl font-bold text-gray-900">{projets.filter(p => p.statut === 'en_cours').length}</p>
      </div>
      <div className="p-2 rounded-lg bg-amber-50">
        <FiCalendar size={24} className="text-amber-700" />
      </div>
    </div>
  </div>

  {/* Terminé */}
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Terminé</p>
        <p className="text-2xl font-bold text-gray-900">{projets.filter(p => p.statut === 'termine').length}</p>
      </div>
      <div className="p-2 rounded-lg bg-emerald-50">
        <FiCheck size={24} className="text-emerald-700" />
      </div>
    </div>
  </div>

  {/* إذا بغيت تقدر تزيد كارت رابعة مثلا Visibles أو أي حاجة أخرى */}
</div>


        {/* Formulaire - يظهر فقط عندما showForm = true */}
        {(showForm || editingId) && (
          <div
            ref={formRef}
            className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl"
          >
            <div className="bg-[#1E6B24] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {editingId ? <FiEdit className="text-white" size={20} /> : <FiPlus className="text-white" size={20} />}
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? 'Modifier le Projet' : 'Nouveau Projet'}
                  </h2>
                </div>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiX size={16} />
                  Annuler
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Titre */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="titre"
                    value={formData.titre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                    placeholder="Entrez le titre du projet"
                    required
                  />
                </div>

                {/* Domaine */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Domaine <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="domain_id"
                    value={formData.domain_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none bg-white"
                    required
                  >
                    <option value="">Sélectionnez un domaine</option>
                    {domaines.map(d => (
                      <option key={d.id} value={d.id} className="py-2">
                        {d.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Partenaire */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Partenaire</label>
                  <input
                    type="text"
                    name="partenaire"
                    value={formData.partenaire}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                    placeholder="Nom du partenaire"
                  />
                </div>

                {/* Statut */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Statut</label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none bg-white"
                  >
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                  </select>
                </div>

                {/* Date de début */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Date de début</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="date_deb"
                      value={formData.date_deb}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Date de fin */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Date de fin</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="date_fin"
                      value={formData.date_fin}
                      onChange={handleInputChange}
                      disabled={formData.statut === "en_cours"}
                      className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none ${formData.statut === "en_cours" ? "bg-gray-50 cursor-not-allowed opacity-70" : ""
                        }`}
                    />
                  </div>
                  {formData.statut === "en_cours" && (
                    <p className="text-sm text-black mt-1">La date de fin sera disponible lorsque le statut passera à "Terminé"</p>
                  )}
                </div>

                {/* Image */}
                <div className="lg:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Image du projet</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-amber-400 transition-colors">
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-[#1E6B24]">
                          <FiImage className="text-white" size={24} />
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">
                            {formData.photo ? formData.photo.name : 'Cliquez pour télécharger une image'}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">PNG, JPG, WEBP jusqu'à 5MB</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Décrivez votre projet..."
                  />
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full lg:w-auto px-8 py-4 bg-[#1E6B24] hover:bg-[#0a3d19] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Traitement...
                    </>
                  ) : editingId ? (
                    <>
                      <FiCheck size={20} />
                      Mettre à jour le Projet
                    </>
                  ) : (
                    <>
                      <FiPlus size={20} />
                      Créer le Projet
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* زر Nouveau Projet يظهر عندما يكون النموذج مخفيًا */}
        {!showForm && !editingId && (
          <div className="mb-8 flex justify-center">

          </div>
        )}

        {/* Liste des projets */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-[#F9F6F0]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
              <div className="flex items-center gap-3 ">
                <div className="p-2 rounded-lg bg-[#1E6B24] ">
                  <FiTag className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">Liste des Projets</h2>
                  <p className="text-black text-sm mt-1">
                    {projets.length} projet(s) au total
                    {!showAllProjects && projets.length > visibleProjectsCount &&
                      ` (${visibleProjectsCount} affichés)`}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {projets.length === 0 ? (
            <div className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-full bg-gray-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiFolder className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">Aucun projet trouvé</h3>
                <p className="text-gray-600 mb-6">Commencez par créer votre premier projet</p>
                <button
                  onClick={handleNewProjectClick}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <FiPlus className="inline mr-2" size={18} />
                  Créer un projet
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Projet</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Domaine</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayedProjects.map((projet) => {
                      const domaine = domaines.find(d => d.id === projet.domain_id);
                      return (
                        <tr key={projet.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0">
                                {projet.photo ? (
                                  <img
                                    src={`${API_URL}${projet.photo}`}
                                    alt={projet.titre}
                                    className="h-14 w-14 rounded-xl object-cover border border-gray-200 shadow-sm"
                                  />
                                ) : (
                                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center">
                                    <FiFolder className="text-gray-400" size={24} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{projet.titre}</h4>
                                {projet.description && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2 max-w-[350px] break-words">{projet.description}</p>
                                )}
                                {projet.partenaire && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                      {projet.partenaire}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-sm font-medium text-gray-700">
                                {domaine?.nom || 'Non spécifié'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <FiCalendar className="text-gray-400" size={14} />
                                <span className="text-sm text-gray-600">Début: {formatDate(projet.date_deb)}</span>
                              </div>
                              {projet.date_fin && (
                                <div className="flex items-center gap-2">
                                  <FiCalendar className="text-gray-400" size={14} />
                                  <span className="text-sm text-gray-600">Fin: {formatDate(projet.date_fin)}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(projet.statut)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenGallery(projet)}
                                className="p-2 rounded-lg hover:bg-blue-50 text-black hover:text-blue-700 transition-colors"
                                title="Gérer la galerie"
                              >
                                <FiImage size={25} />
                              </button>
                              <button
                                onClick={() => handleEdit(projet)}
                                className="p-2 rounded-lg hover:bg-amber-50 text-black hover:text-amber-700 transition-colors"
                                title="Modifier"
                              >
                                <FiEdit size={25} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedId(projet.id);
                                  setShowDeleteModal(true);
                                }}
                                className="text-black hover:text-red-600"
                              >
                                <FiTrash2 size={25} />
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* زر Voir Plus/Moins */}
              {projets.length > visibleProjectsCount && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-center">
                  <button
                    onClick={handleShowMore}
                    className="px-6 py-3 bg-[#1E6B24] hover:bg-[#D59B49] text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {showAllProjects ? (
                      <>
                        <FiChevronUp size={18} />
                        Voir Moins
                      </>
                    ) : (
                      <>
                        <FiEye size={18} />
                        Voir Plus ({projets.length - visibleProjectsCount} autres)
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Gallery Modal */}
      {showGalleryModal && selectedProject && (
        <GalleryModal
          projetId={selectedProject.id}
          projetTitre={selectedProject.titre}
          onClose={() => {
            setShowGalleryModal(false);
            setSelectedProject(null);
          }}
        />
      )}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          if (selectedId) handleDelete(selectedId);
          setShowDeleteModal(false);
        }}
      />




    </div>
  );
};

export default AdminProjets;