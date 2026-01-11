import { useState } from "react";
import AdminPartenaire from "@/components/AdminPartenaire";
import AdminProjets from "@/components/AdminProjets";
import AdminDocuments from "@/components/AdminDocuments";

import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Topbar from "@/components/Topbar";
import { 
  FiUsers, 
  FiSettings, 
  FiChevronRight, 
  FiFileText, 
  FiGrid 
} from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";
import { RiArticleLine } from "react-icons/ri"; // Icône pour les actualités
import AdminActualites from "@/components/AdminActulalites";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"projets" | "partenaires" | "documents" | "actualites">("projets");
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "projets":
        return <AdminProjets />;
      case "partenaires":
        return <AdminPartenaire />;
      case "documents":
        return <AdminDocuments />;
      case "actualites":
        return <AdminActualites />; // ✅ Ajout des actualités
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Global Topbar */}
      <Topbar />

      {/* Global Navigation */}
      <Navigation />

      {/* Main dashboard layout */}
      <div className="flex flex-1 overflow-hidden ">
        {/* Sidebar */}
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              {!collapsed && (
                <div>
                  <h1 className="text-xl font-bold text-gray-800">AdminPanel</h1>
                  <p className="text-xs text-gray-500 mt-1">Tableau de bord</p>
                </div>
              )}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiChevronRight className={`w-5 h-5 text-gray-600 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
              </button>
            </div>

            {/* Navigation inside sidebar */}
            <nav className="flex-1 p-4 space-y-1">
              <button
                className={`w-full flex items-center rounded-lg px-4 py-3 transition-all duration-200 ${activeTab === "projets" ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
                onClick={() => setActiveTab("projets")}
              >
                <MdWorkOutline className={`${collapsed ? 'mx-auto' : 'mr-3'} w-5 h-5`} />
                {!collapsed && <span className="font-medium">Projets</span>}
              </button>

              <button
                className={`w-full flex items-center rounded-lg px-4 py-3 transition-all duration-200 ${activeTab === "partenaires" ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
                onClick={() => setActiveTab("partenaires")}
              >
                <FiUsers className={`${collapsed ? 'mx-auto' : 'mr-3'} w-5 h-5`} />
                {!collapsed && <span className="font-medium">Partenaires</span>}
              </button>

              <button
                className={`w-full flex items-center rounded-lg px-4 py-3 transition-all duration-200 ${activeTab === "actualites" ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
                onClick={() => setActiveTab("actualites")}
              >
                <RiArticleLine className={`${collapsed ? 'mx-auto' : 'mr-3'} w-5 h-5`} />
                {!collapsed && <span className="font-medium">Actualités</span>}
              </button>

              <button
                className={`w-full flex items-center rounded-lg px-4 py-3 transition-all duration-200 ${activeTab === "documents" ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
                onClick={() => setActiveTab("documents")}
              >
                <FiFileText className={`${collapsed ? 'mx-auto' : 'mr-3'} w-5 h-5`} />
                {!collapsed && <span className="font-medium">Documents</span>}
              </button>
            </nav>


          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden ">
          {/* Header content area */}


          {/* Main content */}
          <div className="flex-1 overflow-auto bg-[#F9F6F0]">
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;