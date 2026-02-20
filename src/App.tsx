
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Offer from "./pages/Offer";
import RamadanChallenge from "./pages/RamadanChallenge";
import RamadanDay from "./pages/RamadanDay";
import WebinarLanding from "./pages/WebinarLanding";
import Dashboard from "./pages/Dashboard";
import CustomCursor from "./components/CustomCursor";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { usePageTracker } from "./hooks/usePageTracker";

const queryClient = new QueryClient();

function PageTracker() {
  usePageTracker();
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTracker />
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/ramadan" element={<RamadanChallenge />} />
          <Route path="/ramadan/:day" element={<RamadanDay />} />
          <Route path="/landing" element={<WebinarLanding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
      <SpeedInsights />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
