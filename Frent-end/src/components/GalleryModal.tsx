// components/GalleryModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ImageGallery } from '../types/gallery.types';
import { FiTrash2, FiEye, FiUpload } from 'react-icons/fi';

interface GalleryModalProps {
  projetId: number;
  projetTitre: string;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ projetId, projetTitre, onClose }) => {
  const [images, setImages] = useState<ImageGallery[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageGallery | null>(null);

  
  const API_URL = import.meta.env.VITE_API_URL;
  const GALLERY_URL = `${API_URL}/api/gallery`;

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<ImageGallery[]>(`${GALLERY_URL}/project/${projetId}`);
      setImages(response.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projetId]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
        setError('Type de fichier non supporté');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Fichier trop volumineux (max 5MB)');
        return;
      }
      setSelectedFile(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('project_id', projetId.toString());
    try {
      setUploading(true);
      const response = await axios.post(`${GALLERY_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImages(prev => [...prev, response.data]);
      setSelectedFile(null);
      setPreview(null);
      const input = document.getElementById('file-input') as HTMLInputElement;
      if (input) input.value = '';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  // Request delete modal
  const requestDelete = (img: ImageGallery) => {
    setImageToDelete(img);
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!imageToDelete) return;
    try {
      setLoading(true);
      await axios.delete(`${GALLERY_URL}/${imageToDelete.id}`);
      setImages(prev => prev.filter(img => img.id !== imageToDelete.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setImageToDelete(null);
    }
  };

  const getImageUrl = (filename: string) => `${API_URL.replace('/api','')}/uploads/gallery/${filename}`;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F5FCF8] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-[#1E6B24] text-white">
          <h2 className="text-2xl font-bold text-right">{projetTitre} - Galerie</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">×</button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-right">{error}</div>}

          {/* Upload */}
          <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 text-right space-y-4">
            <label className="block text-sm font-medium mb-2">Ajouter une image</label>
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg border" />
              </div>
            ) : (
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-right text-sm file:bg-[#146C2D] file:text-white file:py-2 file:px-4 file:rounded-lg hover:file:bg-[#0a3d19]"
              />
            )}
            <button
              onClick={uploadImage}
              disabled={!selectedFile || uploading}
              className="px-4 py-2 bg-[#146C2D]  hover:bg-[#0a3d19] text-white rounded-lg flex items-center gap-2"
            >
              <FiUpload />
              {uploading ? 'Chargement...' : 'Télécharger'}
            </button>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map(img => (
              <div key={img.id} className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg">
                <img src={getImageUrl(img.image)} alt="Projet" className="w-full h-48 object-cover" />
                <button
                  onClick={() => requestDelete(img)}
                  className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                ><FiTrash2 /></button>
                <a
                  href={getImageUrl(img.image)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-[#146C2D]  hover:bg-[#D59B49] text-white p-2 rounded-full opacity-0 group-hover:opacity-100"
                ><FiEye /></a>
                <div className="p-2 text-xs text-gray-500 flex justify-between">
                  <span>ID: {img.id}</span>
                  
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#146C2D]  hover:bg-[#0a3d19] text-white rounded-lg"
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && imageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-scaleIn">
            <div className="flex justify-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100">
                <FiTrash2 className="text-red-600" size={28} />
              </div>
            </div>
            <h3 className="mt-4 text-center text-xl font-bold text-gray-900">
              Confirmation de suppression
            </h3>
            <p className="mt-2 text-center text-sm text-gray-600">
              Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
