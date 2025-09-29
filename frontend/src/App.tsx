import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import Courses from "./pages/Courses";
import Instructors from "./pages/Instructors";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Cadastro from "./pages/Cadastro";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import CalendarPage from "./pages/Calendar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/alunos" element={<Layout><Students /></Layout>} />
            <Route path="/turmas" element={<Layout><Classes /></Layout>} />
            <Route path="/cursos" element={<Layout><Courses /></Layout>} />
            <Route path="/instrutores" element={<Layout><Instructors /></Layout>} />
            <Route path="/relatorios" element={<Layout><Reports /></Layout>} />
            <Route path="/admin" element={<Layout><Dashboard /></Layout>} />
            <Route path="/perfil" element={<Layout><Profile /></Layout>} />
            <Route path="/cadastro" element={<Layout><Cadastro /></Layout>} />
            <Route path="/notificacoes" element={<Layout><Notifications /></Layout>} />
            <Route path="/calendario" element={<Layout><CalendarPage /></Layout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
