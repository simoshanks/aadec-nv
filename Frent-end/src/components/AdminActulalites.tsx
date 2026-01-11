import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DeleteModal } from "./DeleteModal";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Upload,
  Image as ImageIcon,
  X,
  Save,
  Search,
  Filter,
  Loader2,
  Eye
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
  date_publication: string;
  auteur?: string;
  is_published?: number;
  vues?: number;
  tags?: string;
};

type Categorie = {
  id: number;
  nom: string;
  couleur: string;
};

const categories: Categorie[] = [
  { id: 1, nom: "Actualité", couleur: "bg-blue-100 text-blue-800" },
  { id: 2, nom: "Événement", couleur: "bg-green-100 text-green-800" },
  { id: 3, nom: "Promotion", couleur: "bg-purple-100 text-purple-800" },
  { id: 4, nom: "Nouveauté", couleur: "bg-yellow-100 text-yellow-800" },
  { id: 5, nom: "Technique", couleur: "bg-red-100 text-red-800" },
];

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }], // ✅ التحكم فالألوان ,
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "blockquote", "code-block"],
    ["clean"],
  ],
};


const quillFormats = [
  "header",
  "color",        
  "background",   
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
  "blockquote",
  "code-block",
];


const AdminActualites = () => {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [filteredActualites, setFilteredActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Actualite>>({
    titre: "",
    resume: "",
    contenu: "",
    categorie: "",
    date_publication: new Date().toISOString().slice(0,16),
    auteur: "Admin",
    is_published: 0,
    tags: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "title" | "views">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedActu, setSelectedActu] = useState<Actualite | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewActu, setPreviewActu] = useState<Actualite | null>(null);

  useEffect(() => { fetchActualites(); }, []);
  useEffect(() => { filterAndSortActualites(); }, [actualites, searchTerm, statusFilter, selectedCategories, sortBy, sortOrder]);

  const fetchActualites = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/actualites?showAll=true`);
      setActualites(response.data);
    } catch { toast.error("Impossible de charger les actualités"); }
    finally { setLoading(false); }
  };

  const filterAndSortActualites = useCallback(() => {
    let filtered = [...actualites];
    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.resume.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.contenu.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(a =>
        statusFilter === "published" ? a.is_published === 1 : a.is_published === 0
      );
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(a => a.categorie && selectedCategories.includes(a.categorie));
    }
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch(sortBy){
        case "title": aVal=a.titre.toLowerCase(); bVal=b.titre.toLowerCase(); break;
        case "views": aVal=a.vues||0; bVal=b.vues||0; break;
        case "date":
        default: aVal=new Date(a.date_publication).getTime(); bVal=new Date(b.date_publication).getTime();
      }
      return sortOrder==="asc"? (aVal>bVal?1:-1) : (aVal<bVal?1:-1);
    });
    setFilteredActualites(filtered);
  }, [actualites, searchTerm, statusFilter, selectedCategories, sortBy, sortOrder]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5*1024*1024) return toast.error("L'image ne doit pas dépasser 5MB");
    if (!file.type.startsWith('image/')) return toast.error("Veuillez sélectionner une image valide");
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      titre: "",
      resume: "",
      contenu: "",
      categorie: "",
      date_publication: new Date().toISOString().slice(0,16),
      auteur: "Admin",
      is_published: 0,
      tags: "",
    });
    setImageFile(null); setImagePreview(null); setEditingId(null);
  };

  const handleEdit = (act: Actualite) => {
    // Convert ISO date => datetime-local
    const dt = new Date(act.date_publication);
    const tzOffset = dt.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(dt.getTime() - tzOffset)).toISOString().slice(0,16);
    setFormData({...act, date_publication: localISOTime});
    setImagePreview(act.image? `${API_URL}/uploads/actualites/${act.image}`: null);
    setEditingId(act.id); 
    setShowForm(true);
    window.scrollTo({ top:0, behavior:"smooth"});
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k,v])=>{ if(v!=null)data.append(k,String(v)); });
      if(imageFile) data.append("image", imageFile);

      if(editingId) await axios.put(`${API_URL}/api/actualites/${editingId}`, data, { headers:{ "Content-Type":"multipart/form-data" } });
      else await axios.post(`${API_URL}/api/actualites`, data, { headers:{ "Content-Type":"multipart/form-data" } });

      toast.success(editingId? "Actualité mise à jour!" : "Actualité créée!");
      resetForm(); setShowForm(false); fetchActualites();
    } catch(err:any){ toast.error(`Erreur: ${err.response?.data?.message || err.message}`); }
    finally{ setSaving(false); }
  };

  const handleDelete = async (id:number) => { try{ await axios.delete(`${API_URL}/api/actualites/${id}`); toast.success("Actualité supprimée!"); fetchActualites(); } catch{ toast.error("Erreur lors de la suppression"); } finally{ setShowDeleteModal(false); }};

  const togglePublish = async (id:number, status?:number) => {
    const newStatus = status===1?0:1;
    try{ await axios.patch(`${API_URL}/api/actualites/${id}`, {is_published:newStatus});
      setActualites(prev=>prev.map(a=>a.id===id?{...a,is_published:newStatus}:a));
      toast.success(newStatus===1?"Publié":"Brouillon");
    } catch{ toast.error("Erreur lors du changement de statut"); }
  };
  const totalActualites = actualites.length;

const publishedCount = actualites.filter(
  (a) => a.is_published === 1
).length;

const draftCount = actualites.filter(
  (a) => a.is_published === 0
).length;

const totalViews = actualites.reduce(
  (sum, a) => sum + (a.vues || 0),
  0
);


  const formatDateTime = (date:string) => new Date(date).toLocaleString("fr-FR", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });

  if(loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-12 h-12 text-blue-600" /></div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-[#F9F6F0] p-4 md:p-6 lg:p-8 text-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#1E6B24] shadow-lg"><FileText className="text-white" size={28} /></div>
              <div>
                <h1 className="text-3xl font-bold">Gestion des Actualités</h1>
                <p className="text-gray-600 mt-1">Gérez et publiez vos contenus facilement</p>
              </div>
            </div>
            <button onClick={()=>{ resetForm(); setShowForm(true); }} className="px-6 py-3 bg-[#1E6B24] text-white rounded-xl flex items-center gap-2">
              <Plus size={20} /> Nouvelle Actualité
            </button>
          </div>
          {/* Stats */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
  
  {/* Total */}
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Total Actualités</p>
        <p className="text-2xl font-bold text-gray-900">
          {totalActualites}
        </p>
      </div>
      <div className="p-2 rounded-lg bg-[#F9F6F0]">
        <FileText className="text-[#146C2D]" size={24} />
      </div>
    </div>
  </div>

  {/* Publiées */}
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Publiées</p>
        <p className="text-2xl font-bold text-gray-900">
          {publishedCount}
        </p>
      </div>
      <div className="p-2 rounded-lg bg-[#F9F6F0]">
        <Eye className="text-[#146C2D]" size={24} />
      </div>
    </div>
  </div>

  {/* Brouillons */}
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Brouillons</p>
        <p className="text-2xl font-bold text-gray-900">
          {draftCount}
        </p>
      </div>
      <div className="p-2 rounded-lg bg-[#F9F6F0]">
        <Edit className="text-[#146C2D]" size={24} />
      </div>
    </div>
  </div>

  {/* Vues */}
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Vues Totales</p>
        <p className="text-2xl font-bold text-gray-900">
          {totalViews}
        </p>
      </div>
      <div className="p-2 rounded-lg bg-[#F9F6F0]">
        <Eye className="text-[#146C2D]" size={24} />
      </div>
    </div>
  </div>

</div>


          {/* Formulaire */}
          {showForm && (
            <div className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{editingId ? "Modifier l'actualité" : "Créer une nouvelle actualité"}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Titre *</label>
                      <input type="text" name="titre" value={formData.titre} onChange={handleInputChange} required className="w-full px-4 py-3 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Résumé *</label>
                      <textarea name="resume" value={formData.resume} onChange={handleInputChange} required rows={3} className="w-full px-4 py-3 border rounded-xl resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Contenu *</label>
                      <ReactQuill theme="snow" value={formData.contenu || ""} onChange={(v) => setFormData(prev => ({ ...prev, contenu: v }))} modules={quillModules} formats={quillFormats} className="h-[400px]" />
                    </div>
                   <br/>
                  </div>

                  <div className="space-y-6">
                    {/* Image */}
                    <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300">
                      <label className="block text-sm font-semibold mb-4">Image principale</label>
                      {imagePreview ? (
                        <div className="relative group">
                          <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                          <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><X size={16} /></button>
                        </div>
                      ) : <div className="flex flex-col items-center justify-center p-8 text-gray-500"><ImageIcon size={48} /><p className="text-sm">Aucune image</p></div>}
                      <label className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg cursor-pointer">
                        <Upload size={18} /> <span>Télécharger</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>

                    {/* Meta */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Catégorie</label>
                        <select name="categorie" value={formData.categorie} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl">
                          <option value="">Sélectionner</option>
                          {categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Date de publication</label>
                        <input type="datetime-local" name="date_publication" value={formData.date_publication} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Statut</label>
                        <select name="is_published" value={formData.is_published} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl">
                          <option value={1}>Publié</option>
                          <option value={0}>Brouillon</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={saving} className="px-6 py-3 bg-[#1E6B24] text-white rounded-xl flex items-center gap-2">
                  <Save size={20} /> {saving ? "Sauvegarde..." : editingId ? "Mettre à jour" : "Créer"}
                </button>
              </form>
            </div>
          )}

          {/* Filtres et Recherche */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search size={20} />
              <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="px-4 py-2 border rounded-xl" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={20} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-4 py-2 border rounded-xl">
                <option value="all">Tous</option>
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="px-4 py-2 border rounded-xl">
                <option value="date">Date</option>
                <option value="title">Titre</option>
                <option value="views">Vues</option>
              </select>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value as any)} className="px-4 py-2 border rounded-xl">
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredActualites.map(act => (
              <div
  key={act.id}
  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition overflow-hidden group"
>
  {/* Image */}
  {act.image && (
    <div className="relative h-48 overflow-hidden">
      <img
        src={`${API_URL}/uploads/actualites/${act.image}`}
        alt={act.titre}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
      />

      {/* Status badge */}
      <span
        className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${
          act.is_published === 1
            ? "bg-green-600 text-white"
            : "bg-gray-700 text-white"
        }`}
      >
        {act.is_published === 1 ? "Publié" : "Brouillon"}
      </span>
    </div>
  )}

  {/* Content */}
  <div className="p-5 flex flex-col h-full">
    {/* Title */}
    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
      {act.titre}
    </h3>

    {/* Resume */}
    <p className="text-gray-600 text-sm mt-2 line-clamp-3">
      {act.resume}
    </p>

    {/* Meta */}
    <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
      <span>{formatDateTime(act.date_publication)}</span>
      <span className="flex items-center gap-1">
        <Eye size={14} /> {act.vues || 0}
      </span>
    </div>

    {/* Actions */}
    <div className="flex gap-2 mt-5">
      <button
        onClick={() => handleEdit(act)}
        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50"
      >
        <Edit size={15} />
        Modifier
      </button>

      <button
        onClick={() => {
          setSelectedActu(act);
          setShowDeleteModal(true);
        }}
        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg border border-red-500 text-red-600 hover:bg-red-50"
      >
        <Trash2 size={15} />
        Supprimer
      </button>

      <button
        onClick={() => {
          setPreviewActu(act);
          setShowPreviewModal(true);
        }}
        className="px-3 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900"
      >
        <Eye size={16} />
      </button>
    </div>
  </div>
</div>

            ))}
          </div>

          {/* Delete Modal */}
          {showDeleteModal && selectedActu && (
            <DeleteModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={() => { if (selectedActu) handleDelete(selectedActu.id); }} />
          )}

          {/* Preview Modal */}
          {showPreviewModal && previewActu && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
              <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
                <button onClick={()=>setShowPreviewModal(false)} className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full"><X size={20}/></button>
                <h2 className="text-2xl font-bold mb-4">{previewActu.titre}</h2>
                {previewActu.image && <img src={`${API_URL}/uploads/actualites/${previewActu.image}`} alt={previewActu.titre} className="w-full h-64 object-cover rounded-lg mb-4" />}
                <p className="text-gray-600 mb-2"><strong>Catégorie:</strong> {previewActu.categorie}</p>
                <p className="text-gray-400 mb-4">{formatDateTime(previewActu.date_publication)}</p>
                <div dangerouslySetInnerHTML={{ __html: previewActu.contenu }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminActualites;
