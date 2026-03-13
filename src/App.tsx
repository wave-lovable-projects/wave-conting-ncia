import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";

import LoginPage from "@/pages/LoginPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import ContasAnuncio from "@/pages/ContasAnuncio";
import BusinessManagers from "@/pages/BusinessManagers";
import Perfis from "@/pages/Perfis";
import Paginas from "@/pages/Paginas";
import Pixels from "@/pages/Pixels";
import Fornecedores from "@/pages/Fornecedores";
import Solicitacoes from "@/pages/Solicitacoes";
import Diagnostico from "@/pages/Diagnostico";
import Sugestoes from "@/pages/Sugestoes";
import Usuarios from "@/pages/Usuarios";
import Atividades from "@/pages/Atividades";
import MetaDashboard from "@/pages/MetaDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<ContasAnuncio />} />
              <Route path="/bms" element={<BusinessManagers />} />
              <Route path="/perfis" element={<Perfis />} />
              <Route path="/paginas" element={<Paginas />} />
              <Route path="/pixels" element={<Pixels />} />
              <Route path="/fornecedores" element={<Fornecedores />} />
              <Route path="/solicitacoes" element={<Solicitacoes />} />
              <Route path="/diagnostico" element={<Diagnostico />} />
              <Route path="/sugestoes" element={<Sugestoes />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/atividades" element={<Atividades />} />
              <Route path="/meta" element={<MetaDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
