import React, { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FileText, Download, Calendar } from "lucide-react";

interface DocumentType {
  id: number;
  title: string;
  description: string;
  doc_date: string | number;
  size: string;
  url: string;
}

const Documentation: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/documents`);
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error("Erreur fetch documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [API_URL]);

  const downloadDocument = (url: string, title: string) => {
    const link = document.createElement("a");
    link.href = `${API_URL}${url}`; // رابط كامل للbackend
    link.download = `${title}.pdf`;
    link.click();
  };
  const formatDocDate = (date: string | number) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Date invalide";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};


  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <Topbar />
      <Navigation />
                  {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#D59B49] to-[#E6C698]  text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentation Officielle</h1>
            <p className="text-xl opacity-90 ">
              Accédez aux documents officiels de l'Association AADEC
            </p>
          </div>
        </div>
      </div>

      <main className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#146C2D] rounded-full mb-4 sm:mb-6 shadow-md shadow-emerald-100">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white rounded-full mr-2 sm:mr-3 animate-pulse"></span>
            <span className="text-white font-medium text-xs sm:text-sm uppercase tracking-wider">
              Documentation
            </span>
          </div>
          <div className="w-20 sm:w-24 lg:w-32 h-1 bg-[#146C2D] mx-auto mb-6 sm:mb-8 rounded-full shadow-sm"></div>
        </div>

          {/* Documents Grid */}
          {loading ? (
            <p className="text-center text-gray-500">Chargement...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col min-h-[220px]"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-[#146C2D] text-white rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 text-center mb-3 break-words">
                    {doc.title}
                  </h3>

                  <p className="text-gray-600 text-sm text-center mb-4 break-words">
                    {doc.description}
                  </p>

                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4 mt-auto">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDocDate(doc.doc_date)}</span>
                    </div>
                    <span>{doc.size}</span>
                  </div>

                  <button
                    onClick={() => downloadDocument(doc.url, doc.title)}
                    className="w-full flex items-center justify-center space-x-2 bg-[#146C2D] hover:bg-[#0a3d19] text-white py-2.5 rounded-xl font-medium transition-colors duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Info Message */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 max-w-2xl mx-auto">
              <p className="text-gray-600 text-sm">
                📄 Pour toute demande de documents supplémentaires, veuillez nous contacter.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Documentation;
