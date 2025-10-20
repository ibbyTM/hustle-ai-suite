import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MyHustles from "./pages/MyHustles";
import Analytics from "./pages/Analytics";
import Affiliate from "./pages/Affiliate";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import KnowledgeBases from "./pages/KnowledgeBases";
import KnowledgeBaseEditor from "./pages/KnowledgeBaseEditor";
import FounderPass from "./pages/FounderPass";
import CreatorPass from "./pages/CreatorPass";
import CreatorPassCheckEmail from "./pages/CreatorPassCheckEmail";
import Install from "./pages/Install";
import CourseGuides from "./pages/CourseGuides";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { useEffect } from "react";

// Component to handle /ref/:code redirects
const RefRedirect = () => {
  const code = window.location.pathname.split('/ref/')[1];
  return <Navigate to={`/auth?ref=${code}`} replace />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Register service worker manually
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('SW registration failed:', err);
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-hustles" element={<MyHustles />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/knowledge-bases" element={<KnowledgeBases />} />
                <Route path="/knowledge-bases/:id" element={<KnowledgeBaseEditor />} />
                <Route path="/course-guides" element={<CourseGuides />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/founder-pass" element={<FounderPass />} />
                <Route path="/creator-pass" element={<CreatorPass />} />
                <Route path="/creator-pass-check-email" element={<CreatorPassCheckEmail />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/install" element={<Install />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/ref/:code" element={<RefRedirect />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
