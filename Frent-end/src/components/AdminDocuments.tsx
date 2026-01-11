import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiDownload, FiEdit, FiFolder, FiPlus, FiTag, FiTrash2, FiX } from 'react-icons/fi';
import { DeleteModal } from './DeleteModal';
import { Folder } from 'lucide-react';

const AdminDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    doc_date: '',
    file: null as File | null
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);


  const API_URL = import.meta.env.VITE_API_URL;

  // Récupérer les documents
  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/api/documents`);
      setDocuments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la récupération des documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Gestion des inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      doc_date: '',
      file: null
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSuccessMessage('');
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!formData.title.trim()) {
      setError('Le titre est obligatoire');
      return;
    }

    if (!editingId && !formData.file) {
      setError('Veuillez sélectionner un fichier pour le nouveau document');
      return;
    }

    try {
      if (editingId) {
        await updateDocument();
      } else {
        await addDocument();
      }
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
    }
  };

  const addDocument = async () => {
    setIsUploading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('doc_date', formData.doc_date);
      if (formData.file) {
        data.append('file', formData.file);
      }

      const response = await axios.post(`${API_URL}/api/documents/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMessage(response.data.message || 'Document ajouté avec succès');
      resetForm();
      fetchDocuments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'ajout du document');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const updateDocument = async () => {
    setIsUploading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('doc_date', formData.doc_date);

      // Ajouter le fichier seulement s'il y en a un nouveau
      if (formData.file) {
        data.append('file', formData.file);
      }

      const response = await axios.put(`${API_URL}/api/documents/${editingId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMessage(response.data.message || 'Document mis à jour avec succès');
      resetForm();
      fetchDocuments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour du document');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;

    try {
      const response = await axios.delete(`${API_URL}/api/documents/${selectedDocument.id}`);
      setSuccessMessage(response.data.message || 'Document supprimé avec succès');
      fetchDocuments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la suppression du document');
      console.error(err);
    } finally {
      setSelectedDocument(null);
      setShowDeleteModal(false);
    }
  };


  const handleEdit = (doc: any) => {
    setFormData({
      title: doc.title,
      description: doc.description || '',
      doc_date: doc.doc_date ? new Date(doc.doc_date).toISOString().split('T')[0] : '',
      file: null
    });
    setEditingId(doc.id);
    setShowForm(true);

    // Scroller vers le formulaire
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDownload = (url: string) => {
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
      window.open(fullUrl, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifié';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-[#F9F6F0] min-h-screen text-gray-800">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#1E6B24] shadow-lg">
              <Folder className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Documents</h1>
              <p className="text-gray-600 mt-1">Ajoutez, modifiez ou supprimez vos Documents</p>
            </div>
          </div>

          {/* Bouton Nouveau Document */}
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-6 py-3 bg-[#1E6B24] hover:bg-[#0a3d19]  text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FiPlus size={20} />
            Nouveau Document
          </button>
        </div>
      </div>

      {/* Messages d'alerte */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <div className="flex justify-between items-center">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError('')}
              className="text-red-700 hover:text-red-900 font-bold ml-4"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <div className="flex justify-between items-center">
            <span className="block sm:inline">{successMessage}</span>
            <button
              onClick={() => setSuccessMessage('')}
              className="text-green-700 hover:text-green-900 font-bold ml-4"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div ref={formRef} className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingId ? 'Modifier le Document' : 'Ajouter un Nouveau Document'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-gray-700">Titre *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Titre du document"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D59B49] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description (optionnel)"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D59B49] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Date du Document</label>
              <input
                type="date"
                name="doc_date"
                value={formData.doc_date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D59B49] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                {editingId ? 'Changer le fichier (optionnel)' : 'Fichier *'}
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1E6B24] file:text-white hover:file:bg-[#146C2D]"
              />
              <p className="text-sm text-gray-500 mt-1">
                Types autorisés: PDF, DOC, DOCX, TXT, ZIP, RAR (max 10MB)
                {editingId && " - Laissez vide pour conserver le fichier actuel"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-[#1E6B24] hover:bg-[#0a3d19]  text-white font-medium rounded-lg transition duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white "></span>
                    Envoi en cours...
                  </>
                ) : editingId ? (
                  <>
                    <FiEdit />
                    Mettre à jour
                  </>
                ) : (
                  <>
                    <FiPlus />
                    Ajouter
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition duration-300"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tableau des documents */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#1E6B24]">
            <FiTag className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Liste des Documents ({documents.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E6B24]"></div>
            <p className="mt-2 text-gray-600">Chargement des documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FiFolder className="mx-auto text-gray-400" size={48} />
            <p className="mt-2 text-gray-600">Aucun document disponible</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{doc.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 max-w-xs truncate">
                        {doc.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {formatDate(doc.doc_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {doc.size || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(doc.url)}
                          className="p-2 text-gray-600 hover:text-[#1E6B24] hover:bg-gray-100 rounded-lg transition"
                          title="Télécharger"
                        >
                          <FiDownload size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(doc)}
                          className="p-2 text-gray-600 hover:text-[#D59B49] hover:bg-gray-100 rounded-lg transition"
                          title="Modifier"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition"
                          title="Supprimer"
                        >
                          <FiTrash2 size={18} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <DeleteModal
              show={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={handleDelete} // دير handleDelete بلا ما تحتاج confirm window
              message={selectedDocument ? `Voulez-vous vraiment supprimer "${selectedDocument.title}" ?` : undefined}
            />

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDocuments;