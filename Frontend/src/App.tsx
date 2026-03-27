import { Elements } from '@stripe/react-stripe-js';
import stripePromise from './lib/stripe';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
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
import FarmerSchemes from "./pages/FarmerSchemes";
<<<<<<< HEAD
import PaymentPage from "./pages/PaymentPage";
=======
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip"; // or correct path
import { Toaster } from "@/components/ui/toaster"; // adjust path
import { Toaster as Sonner } from "sonner"; // correct import for Sonner

>>>>>>> 2ff4443ddec2f0c66daa77e43f4b0c95a03f6916

import DashboardRoutes from "./layouts/DashboardRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Elements stripe={stripePromise}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" theme="light" richColors duration={2000} />
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
              <Route path="schemes" element={<FarmerSchemes />} />
              <Route path="payment" element={<PaymentPage />} />
            </Route>

            <Route path="/officer-review" element={<OfficerReview />} />
            <Route path="/officer/farmers" element={<OfficerFarmers />} />
            <Route path="/officer/policies" element={<OfficerPolicies />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Elements>
  </QueryClientProvider>
);

export default App;
