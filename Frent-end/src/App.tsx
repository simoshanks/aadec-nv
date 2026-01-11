import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";

import Apropos from "./pages/Apropos";
import Documentation from "./pages/Documentation";

import Partenaires from "./pages/Partenaires";
import ProjetDetail from "./pages/Projetdetail";

import Projets from "./pages/Projets";
import InfoProjet from "./pages/InfoProjet";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Actualites from "./pages/Actualites";
import ActualiteDetail from "./pages/ActualiteDetail";
import ScrollToTop from "./components/ScrollToTop";




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
    <ScrollToTop/>
        <Routes>
          
          <Route path="/" element={<Index />} />
          <Route path="/apropos" element={<Apropos />} />
           <Route path="/Realisations/:domainSlug/:projectSlug" element={<ProjetDetail />} />
          <Route path="/Partenaires" element={<Partenaires />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projets" element={<Projets />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/actualites/:slug" element={<ActualiteDetail />} />
          
          <Route path="/projet/:id" element={<InfoProjet />} />
          <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
          
          



          {/*  CUSTOM ROUTES  ABOVE"*" ROUTE */}

          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
