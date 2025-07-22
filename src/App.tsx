import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import { GlobalMusicProvider } from "./hooks/useGlobalMusicPlayer";
import AuthGuard from "./components/AuthGuard";
import Index from "./pages/Index";
import Desktop from "./pages/Desktop";
import Pictures from "./pages/Pictures";
import MyVideos from "./pages/MyVideos";
import MyProjects from "./pages/MyProjects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <GlobalMusicProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthGuard>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/desktop" element={<Desktop />} />
                <Route path="/pictures" element={<Pictures />} />
                <Route path="/videos" element={<MyVideos />} />
                <Route path="/projects" element={<MyProjects />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthGuard>
          </BrowserRouter>
        </TooltipProvider>
      </GlobalMusicProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;