import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Desktop from "./pages/Desktop";
import Pictures from "./pages/Pictures";
import MyVideos from "./pages/MyVideos";
import MyProjects from "./pages/MyProjects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Temporary simplified App without QueryClient and complex providers
const App = () => {
  console.log('App component rendering...');
  
  return (
    <div>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/desktop" element={<Desktop />} />
            <Route path="/pictures" element={<Pictures />} />
            <Route path="/videos" element={<MyVideos />} />
            <Route path="/projects" element={<MyProjects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </div>
  );
};

export default App;