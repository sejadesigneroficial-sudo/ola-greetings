import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { AppDownloadBar } from "@/components/layout/AppDownloadBar";
import Index from "./pages/Index";
import Leiloes from "./pages/Leiloes";
import LeilaoDetalhes from "./pages/LeilaoDetalhes";
import ComoFunciona from "./pages/ComoFunciona";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";
import Edital from "./pages/Edital";
import Servicos from "./pages/Servicos";
import FAQ from "./pages/FAQ";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ClientAuth from "./pages/ClientAuth";
import MeuPerfil from "./pages/MeuPerfil";
import MeusArremates from "./pages/MeusArremates";
import MeusFavoritos from "./pages/MeusFavoritos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <AppDownloadBar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/leiloes" element={<Leiloes />} />
        <Route path="/leilao/:id" element={<LeilaoDetalhes />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/edital" element={<Edital />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/entrar" element={<ClientAuth />} />
        <Route path="/meu-perfil" element={<MeuPerfil />} />
        <Route path="/meus-arremates" element={<MeusArremates />} />
        <Route path="/meus-favoritos" element={<MeusFavoritos />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
