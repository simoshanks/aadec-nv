import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  CalendarDays, Clock, ArrowLeft, Share2, Bookmark, User, Tag,
  Facebook, Twitter, Linkedin, Mail
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
  auteur?: string;
  temps_lecture?: number;
};

const ActualiteContentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [actualite, setActualite] = useState<Actualite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Actualite[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchActualite = async () => {
      try {
        setLoading(true);
        setError(null);

        // fetch all actualités
        const res = await axios.get<Actualite[]>(`${API_URL}/api/actualites`);

        const foundArticle = res.data.find(a => a.slug === slug);

        if (!foundArticle) {
          setError("Actualité non trouvée");
          return;
        }

        setActualite(foundArticle);

        // check localStorage bookmark
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        setIsBookmarked(bookmarks.includes(foundArticle.id));

        // related articles
        const related = res.data
          .filter(a => a.id !== foundArticle.id && a.categorie === foundArticle.categorie)
          .slice(0, 3);
        setRelatedArticles(related);

      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'article. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchActualite();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share && actualite) {
      navigator.share({
        title: actualite.titre,
        text: actualite.resume,
        url: window.location.href,
      });
    }
  };

  const handleBookmark = () => {
    if (!actualite) return;
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    let updated: number[];
    if (isBookmarked) {
      updated = bookmarks.filter((id: number) => id !== actualite.id);
      setIsBookmarked(false);
    } else {
      updated = [...bookmarks, actualite.id];
      setIsBookmarked(true);
    }
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#0056A8] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-gray-600">Chargement de l'article...</p>
      </div>
    );
  }

  if (error || !actualite) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 ">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article non trouvé</h2>
          <p className="text-gray-600 mb-8">{error || "L'article que vous cherchez n'existe pas ou a été déplacé."}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate(-1)} className="px-6 py-3 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <Link to="/actualites" className="px-6 py-3 bg-[#0056A8] text-white rounded-lg hover:bg-[#004494] transition-colors text-center">
              Voir toutes les actualités
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0]">

      {/* Header */}
      <div className="relative">
        {actualite.image ? (
          <div className="h-[400px] md:h-[500px] w-full overflow-hidden relative">
            <img
              src={`${API_URL}/uploads/actualites/${actualite.image}`}
              alt={actualite.titre}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          </div>
        ) : (
          <div className="h-[400px] md:h-[500px] w-full bg-gray-300 flex items-center justify-center text-gray-600">
            Image non disponible
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-6xl mx-auto px-4 pb-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
              
              <div className="flex items-center gap-3">
                <button onClick={handleShare} className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors" aria-label="Partager">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleBookmark}
                  className={`p-2 backdrop-blur-sm rounded-full transition-colors ${isBookmarked ? "bg-[#0056A8] text-white" : "bg-white/20 hover:bg-white/30 text-white"}`}
                  aria-label="Sauvegarder"
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="max-w-3xl">
              {actualite.categorie && (
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  {actualite.categorie}
                </span>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {actualite.titre}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                {actualite.date_publication && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <time dateTime={actualite.date_publication}>
                      {formatDate(actualite.date_publication)}
                    </time>
                  </div>
                )}
                
                {actualite.temps_lecture && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{actualite.temps_lecture} min de lecture</span>
                  </div>
                )}
                
                {actualite.auteur && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{actualite.auteur}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 py-12 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 lg:p-12">

          {/* Résumé */}
          {actualite.resume ? (
            <div className="mb-10">
              <p className="text-xl text-gray-700 leading-relaxed border-l-4 border-[#0056A8] pl-4 py-2 italic line-clamp-3">
                {actualite.resume}
              </p>
            </div>
          ) : (
            <div className="mb-10">
              <p className="text-gray-400 italic">Résumé non disponible</p>
            </div>
          )}

          {/* Contenu */}
          <article className="prose prose-lg max-w-none">
            <div className="article-content" dangerouslySetInnerHTML={{ __html: actualite.contenu }} />
          </article>

          {/* Tags et partage */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="w-5 h-5 text-gray-400" />
                {actualite.categorie && (
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    #{actualite.categorie}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Partager :</span>
                <div className="flex gap-3">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors" aria-label="Partager sur Facebook">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(actualite.titre)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-blue-400 rounded-full hover:bg-blue-100 transition-colors" aria-label="Partager sur Twitter">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors" aria-label="Partager sur LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={`mailto:?subject=${encodeURIComponent(actualite.titre)}&body=${encodeURIComponent(`${actualite.titre}\n\n${window.location.href}`)}`} className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors" aria-label="Partager par email">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles similaires */}
      {relatedArticles.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#146C2D] mb-4">Articles similaires</h2>
            <p className="text-gray-600">Découvrez d'autres actualités de la même catégorie</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedArticles.map(article => (
              <Link key={article.id} to={`/actualites/${article.slug}`} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                {article.image && (
                  <div className="h-48 overflow-hidden">
                    <img src={`${API_URL}/uploads/actualites/${article.image}`} alt={article.titre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  </div>
                )}
                <div className="p-6">
                  {article.categorie && (
                    <span className="inline-block px-3 py-1 bg-[#F9F6F0]/10 text-[#146C2D] text-sm font-semibold rounded-full mb-3">
                      {article.categorie}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#146C2D] transition-colors line-clamp-2">
                    {article.titre}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{article.resume}</p>
                  {article.date_publication && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      <time dateTime={article.date_publication}>{new Date(article.date_publication).toLocaleDateString('fr-FR')}</time>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/actualites" className="px-8 py-4 text-white bg-[#146C2D] font-bold rounded-xl hover:bg-[#0a3d19] transition-colors duration-300">
              Voir toutes les actualités
            </Link>
          </div>
        </div>
      )}

      {/* Styles pour article */}
      <style>{`
  /* المحتوى الداخلي للمقالات */
  .article-content {
    line-height: 1.8;
    color: #333; /* لون نص محايد */
    font-family: 'Inter', sans-serif;
  }

  .article-content h2, .article-content h3 {
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    line-height: 1.3;
    color: inherit; /* يسمح بتغيير اللون من الـadmin */
  }

  .article-content h2 { font-size: 2rem; }
  .article-content h3 { font-size: 1.5rem; }

  .article-content p {
    margin-bottom: 1rem;
  }

  .article-content ul, .article-content ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  .article-content li {
    margin-bottom: 0.5rem;
  }

  .article-content blockquote {
    border-left: 4px solid #ccc; /* لون محايد */
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #555;
  }

  .article-content img {
    max-width: 100%;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
  }

  .article-content a {
    color: #146C2D; /* فقط رابط */
    text-decoration: underline;
  }

  .article-content a:hover {
    text-decoration: none;
  }
`}</style>

    </div>
  );
};

export default ActualiteContentDetail;
