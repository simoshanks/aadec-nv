import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Partenaire {
  id: string;
  nom: string;
  logo?: string;
}

interface Categorie {
  id: string;
  titre: string;
  partenaires: Partenaire[];
}

const API_URL = import.meta.env.VITE_API_URL;

export default function PartnersCarousel() {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);

  /* 🔧 Logo processing */
  const processLogo = (p: Partenaire): Partenaire => {
    if (!p.logo) return p;
    if (p.logo.startsWith("http")) return p;
    if (p.logo.startsWith("/uploads")) {
      return { ...p, logo: `${API_URL}${p.logo}` };
    }
    return { ...p, logo: `${API_URL}/uploads/logos/${p.logo}` };
  };

  /* 📡 Fetch */
  useEffect(() => {
    const fetchPartenaires = async () => {
      try {
        const res = await fetch(`${API_URL}/api/partenaires/categories`);
        const data: Categorie[] = await res.json();

        const all = data
          .flatMap((cat) => cat.partenaires)
          .map(processLogo)
          .filter((p) => p.logo && p.logo.trim() !== "");

        setPartenaires(all);
      } catch (err) {
        console.error("Erreur partenaires:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartenaires();
  }, []);

  /* 📱 Responsive */
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) setVisibleCount(2);
      else if (window.innerWidth < 768) setVisibleCount(3);
      else if (window.innerWidth < 1024) setVisibleCount(4);
      else setVisibleCount(5);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? partenaires.length - visibleCount : prev - 1
    );
  };

  const nextSlide = () => {
    setIndex(
      (prev) => (prev + 1) % (partenaires.length - visibleCount + 1)
    );
  };

  /* ⏱️ Auto scroll (هادئ) */
  useEffect(() => {
    if (partenaires.length === 0) return;
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [visibleCount, partenaires.length]);

  if (loading || partenaires.length === 0) return null;

  return (
    
    <section className="w-full bg-gray-50 border-t border-[#D59B49]/20 py-6 md:py-8">

      <div className="relative overflow-hidden w-full max-w-6xl mx-auto">

        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${(index * 100) / visibleCount}%)`,
            width: `${(partenaires.length * 100) / visibleCount}%`,
          }}
        >
          {partenaires.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center shrink-0 px-3"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <div className="bg-white p-3 rounded-md shadow-sm w-full max-w-[120px] mx-auto">
                <img
                  src={p.logo}
                  alt={p.nom}
                  className="h-12 md:h-16 w-full object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition"
                />
              </div>

              <p className="text-gray-600 text-center text-xs md:text-sm mt-2 px-1">
                {p.nom}
              </p>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#146C2D] p-2 rounded-full opacity-60 hover:opacity-90 transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#146C2D] p-2 rounded-full opacity-60 hover:opacity-90 transition"
          aria-label="Suivant"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </section>
  );
}
