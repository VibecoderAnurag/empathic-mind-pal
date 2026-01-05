import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeTheme } from "@/utils/themeManager";
import { ResetThemeButton } from "@/components/ResetThemeButton";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import BreathingExercise from "./pages/BreathingExercise";
import EmotionTest from "./pages/EmotionTest";
import FacialEmotion from "./pages/FacialEmotion";
import GratitudeReflection from "./pages/GratitudeReflection";
import WellnessRoutine from "./pages/WellnessRoutine";
import PositiveMemoryRecall from "./pages/PositiveMemoryRecall";
import NotFound from "./pages/NotFound";
import Models from "./pages/Models";

const queryClient = new QueryClient();

const App = () => {
  // Initialize theme on app load
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/breathing" element={<BreathingExercise />} />
            <Route path="/gratitude" element={<GratitudeReflection />} />
            <Route path="/wellness" element={<WellnessRoutine />} />
            <Route path="/memory" element={<PositiveMemoryRecall />} />
            <Route path="/emotion-test" element={<EmotionTest />} />
            <Route path="/facial-emotion" element={<FacialEmotion />} />
            <Route path="/models" element={<Models />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ResetThemeButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
