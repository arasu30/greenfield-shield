import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BuyPolicy from "./pages/BuyPolicy";
import MyPolicies from "./pages/MyPolicies";
import ClaimDamage from "./pages/ClaimDamage";
import CropHealth from "./pages/CropHealth";
import OfficerReview from "./pages/OfficerReview";
import OfficerFarmers from "./pages/OfficerFarmers.tsx";
import OfficerPolicies from "./pages/OfficerPolicies";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import DashboardRoutes from "./layouts/DashboardRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Nested Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardRoutes />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="buy-policy" element={<BuyPolicy />} />
            <Route path="my-policies" element={<MyPolicies />} />
            <Route path="claim-damage" element={<ClaimDamage />} />
            <Route path="crop-health" element={<CropHealth />} />
          </Route>

          <Route path="/officer-review" element={<OfficerReview />} />
          <Route path="/officer/farmers" element={<OfficerFarmers />} />
          <Route path="/officer/policies" element={<OfficerPolicies />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
