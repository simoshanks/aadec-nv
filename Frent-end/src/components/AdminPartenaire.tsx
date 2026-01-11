import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import {
  Plus, Edit, Trash2, Upload, X, Check,
  AlertCircle, Loader2, Image as ImageIcon,
  Users, Building2, Filter, Eye
} from 'lucide-react';
import { DeleteModal } from './DeleteModal';

// تعريف الأنواع
interface Categorie {
  id: number;
  titre: string;
  description?: string;
}

interface Partenaire {
  id: number;
  nom: string;
  categorie_id: number;
  logo?: string;
  logoUrl?: string;
}

interface PartenaireFormData {
  id?: number;
  nom: string;
  categorie_id: string;
  logo?: File | null;
}

const AdminPartenaire: React.FC = () => {
  // الحالات الأساسية
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(5);

  // حالات النماذج والحوارات
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<PartenaireFormData>({
    nom: '',
    categorie_id: '',
    logo: null
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPartenaire, setSelectedPartenaire] = useState<Partenaire | null>(null);


  // حالات التنبيهات
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  }>({
    type: 'info',
    message: '',
    show: false
  });

  // حالة معاينة الصورة
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // API base URL
  const API_URL = import.meta.env.VITE_API_URL;

  // جلب الشركاء
  const fetchPartenaires = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Partenaire[]>(`${API_URL}/api/partenaires`);
      setPartenaires(response.data);
    } catch (error) {
      showAlert('error', 'Erreur lors du chargement des partenaires');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // جلب الفئات
  const fetchCategories = async () => {
    try {
      const response = await axios.get<Categorie[]>(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      showAlert('error', 'Erreur lors du chargement des catégories');
      console.error(error);
    }
  };

  // عرض التنبيهات
  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message, show: true });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 5000);
  };

  // فتح نموذج الإضافة
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ nom: '', categorie_id: '', logo: null });
    setImagePreview(null);
    setShowModal(true);
  };

  // فتح نموذج التعديل
  const openEditModal = (partenaire: Partenaire) => {
    setIsEditing(true);
    setFormData({
      id: partenaire.id,
      nom: partenaire.nom,
      categorie_id: partenaire.categorie_id.toString(),
      logo: null
    });
    if (partenaire.logoUrl) setImagePreview(partenaire.logoUrl);
    else if (partenaire.logo) setImagePreview(`${API_URL}/uploads/logos/${partenaire.logo}`);
    else setImagePreview(null);
    setShowModal(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
      if (!validTypes.includes(file.type)) return showAlert('error', 'Format non supporté');
      if (file.size > 5 * 1024 * 1024) return showAlert('error', 'Max 5MB');
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => { setFormData(prev => ({ ...prev, logo: null })); setImagePreview(null); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nom.trim()) return showAlert('error', 'Le nom est obligatoire');
    if (!formData.categorie_id) return showAlert('error', 'Sélectionnez une catégorie');

    try {
      setSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('categorie_id', formData.categorie_id);

      // فقط إذا اختار المستخدم ملف جديد
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      if (isEditing && formData.id) {
        await axios.put(`${API_URL}/api/partenaires/${formData.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showAlert('success', 'Partenaire modifié avec succès');
      } else {
        await axios.post(`${API_URL}/api/partenaires`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showAlert('success', 'Partenaire ajouté avec succès');
      }

      fetchPartenaires();
      setShowModal(false);

    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      showAlert('error', axiosError.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };


  const handleDelete = async () => {
    if (!selectedPartenaire) return;
    try {
      await axios.delete(`${API_URL}/api/partenaires/${selectedPartenaire.id}`);
      showAlert('success', `Partenaire "${selectedPartenaire.nom}" supprimé`);
      fetchPartenaires();
    } catch (error) {
      showAlert('error', 'Erreur lors de la suppression');
      console.error(error);
    }
  };


  const getCategorieName = (categorieId: number) => {
    const categorie = categories.find(c => c.id === categorieId);
    return categorie ? categorie.titre : 'Inconnue';
  };

  useEffect(() => { fetchPartenaires(); fetchCategories(); }, []);

  

  return (
    <div className="min-h-screen bg-[#F9F6F0] p-4 md:p-6 lg:p-8 text-black">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-[#1E6B24] shadow-lg">
              <Users className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Partenaires</h1>
              <p className="text-gray-600 mt-2">Gérez votre réseau de partenaires stratégiques</p>
            </div>
          </div>
          {/* statuq */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Partenaires</p>
                  <p className="text-2xl font-bold text-gray-900">{partenaires.length}</p>
                </div>
                <div className="p-2 rounded-lg bg-[#F9F6F0]">
                  <Users className="text-[#1E6B24]" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Catégories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
                <div className="p-2 rounded-lg bg-[#F9F6F0]">
                  <Filter className="text-[#1E6B24]" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Visibles</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.min(visibleCount, partenaires.length)}/{partenaires.length}</p>
                </div>
                <div className="p-2 rounded-lg bg-[#F9F6F0]">
                  <Eye className="text-[#1E6B24]" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Section */}
        {alert.show && (
          <div className={`mb-6 p-4 rounded-xl shadow-sm border flex items-center justify-between animate-fadeIn ${alert.type === 'success'
              ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200'
              : alert.type === 'error'
                ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
                : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${alert.type === 'success' ? 'bg-emerald-100' :
                  alert.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                {alert.type === 'success' ? <Check className="text-emerald-600" size={20} /> :
                  alert.type === 'error' ? <AlertCircle className="text-red-600" size={20} /> :
                    <AlertCircle className="text-blue-600" size={20} />}
              </div>
              <span className={`font-medium ${alert.type === 'success' ? 'text-emerald-800' :
                  alert.type === 'error' ? 'text-red-800' : 'text-blue-800'
                }`}>
                {alert.message}
              </span>
            </div>
            <button
              onClick={() => setAlert(prev => ({ ...prev, show: false }))}
              className={`p-1 rounded-lg hover:bg-white/50 ${alert.type === 'success' ? 'text-emerald-600 hover:text-emerald-800' :
                  alert.type === 'error' ? 'text-red-600 hover:text-red-800' :
                    'text-blue-600 hover:text-blue-800'
                }`}
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Action Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="text-gray-500" size={20} />
            <span className="text-gray-700 font-medium">Liste des Partenaires</span>
          </div>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-[#1E6B24] hover:bg-[#0a3d19]  text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span className="font-semibold">Nouveau Partenaire</span>
          </button>
        </div>

        {/* Partenaires Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          {loading && partenaires.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
              <p className="text-gray-600">Chargement des partenaires...</p>
            </div>
          ) : partenaires.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-full bg-gray-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2">Aucun partenaire trouvé</h3>
                <p className="text-gray-600 mb-6">Commencez par ajouter votre premier partenaire</p>
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Plus size={20} />
                  Ajouter un partenaire
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="py-4 px-6 text-left">
                      <div className="flex items-center gap-2">
                        <ImageIcon size={18} className="text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Logo</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <div className="flex items-center gap-2">
                        <Building2 size={18} className="text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Partenaire</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Catégorie</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {partenaires.slice(0, visibleCount).map((partenaire) => (
                    <tr key={partenaire.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-5 px-6">
                        <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 overflow-hidden p-2">
                          {partenaire.logoUrl || partenaire.logo ? (
                            <img
                              src={partenaire.logoUrl || `${API_URL}/uploads/logos/${partenaire.logo}`}
                              alt={partenaire.nom}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <ImageIcon className="text-gray-400 mb-1" size={24} />
                              <span className="text-xs text-gray-400">Aucun logo</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{partenaire.nom}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                              ID: {partenaire.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="font-medium text-gray-700">
                            {getCategorieName(partenaire.categorie_id)}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(partenaire)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit size={16} />
                            <span className="font-medium">Modifier</span>
                          </button>
                          <button
                            onClick={() => { setSelectedPartenaire(partenaire); setShowDeleteModal(true); }}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg border border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                            <span className="font-medium">Supprimer</span>
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Load More Section */}
              {visibleCount < partenaires.length && (
                <div className="px-6 py-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">
                      Affichage de <span className="font-bold">{Math.min(visibleCount, partenaires.length)}</span> sur{' '}
                      <span className="font-bold">{partenaires.length}</span> partenaires
                    </p>
                    <button
                      onClick={() => setVisibleCount(prev => prev + 5)}
                      className="px-6 py-3 bg-[#1E6B24] hover:bg-[#0a3d19]  text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Eye size={18} />
                      <span className="font-semibold">Voir plus de partenaires</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1E6B24] px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  {isEditing ? <Edit className="text-white" size={24} /> : <Plus className="text-white" size={24} />}
                </div>
                <h2 className="text-xl font-bold text-white">
                  {isEditing ? 'Modifier le Partenaire' : 'Nouveau Partenaire'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Nom Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Nom du Partenaire <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom du partenaire"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300"
                />
              </div>

              {/* Catégorie Select */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  name="categorie_id"
                  value={formData.categorie_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 bg-white"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(categorie => (
                    <option key={categorie.id} value={categorie.id} className="py-2">
                      {categorie.titre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Logo Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">Logo du Partenaire</label>

                {imagePreview && (
                  <div className="relative">
                    <div className="w-48 h-48 border-2 border-gray-200 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        src={imagePreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-400 transition-colors duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-3 rounded-full bg-[#1E6B24] ">
                        <Upload className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">
                          {imagePreview ? 'Changer le logo' : 'Télécharger un logo'}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          Formats supportés: JPEG, PNG, GIF, SVG, WebP
                        </p>
                        <p className="text-gray-500 text-sm">Taille maximale: 5MB</p>
                      </div>
                      <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        {imagePreview ? 'Choisir un autre fichier' : 'Choisir un fichier'}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300 font-medium"
                    disabled={submitting}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-[#1E6B24] hover:bg-[#0a3d19]  text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    {submitting && <Loader2 className="animate-spin" size={18} />}
                    <span className="font-semibold">
                      {isEditing ? 'Mettre à jour' : 'Créer le Partenaire'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>

      )}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message={selectedPartenaire ? `Voulez-vous vraiment supprimer "${selectedPartenaire.nom}" ?` : undefined}
      />

    </div>

  );
};

export default AdminPartenaire;