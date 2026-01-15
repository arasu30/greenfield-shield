import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AnimatedParticles } from "@/components/AnimatedParticles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Info } from "lucide-react";
import { toast } from "sonner";

const BuyPolicy = () => {
  const navigate = useNavigate();
  const [cropType, setCropType] = useState("");
  const [season, setSeason] = useState("");
  const [landArea] = useState("5.0"); // Auto-filled
  const [premium, setPremium] = useState(0);

  const calculatePremium = (crop: string, seas: string) => {
    const baseRates: { [key: string]: number } = {
      "Rice": 1200,
      "Wheat": 1000,
      "Cotton": 1500,
      "Sugarcane": 1800,
      "Maize": 900,
    };
    const seasonMultiplier = seas === "Kharif" ? 1.2 : 1.0;
    const rate = baseRates[crop] || 1000;
    return Math.round(rate * parseFloat(landArea) * seasonMultiplier);
  };

  const handleCropChange = (value: string) => {
    setCropType(value);
    if (season) {
      setPremium(calculatePremium(value, season));
    }
  };

  const handleSeasonChange = (value: string) => {
    setSeason(value);
    if (cropType) {
      setPremium(calculatePremium(cropType, value));
    }
  };

  const handleProceedToPayment = () => {
    if (!cropType || !season) {
      toast.error("Please select crop type and season");
      return;
    }
    toast.success("Proceeding to payment gateway...");
    setTimeout(() => {
      toast.success("Policy purchased successfully!");
      navigate("/my-policies");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-900 to-slate-950 relative overflow-hidden">
      {/* Animated background particles */}
      <AnimatedParticles />

      {/* Gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse" style={{animationDelay: '2s'}}></div>

      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-8 text-slate-300 hover:text-emerald-400 transition-all duration-300">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-10">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent mb-3">Buy Insurance Policy</h2>
          <p className="text-lg text-slate-300 font-medium">Protect your crops with comprehensive AI-powered coverage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="backdrop-blur-2xl bg-slate-900/80 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 hover:border-emerald-400/50 hover:shadow-emerald-400/30 transition-all duration-300">
              <CardHeader className="pb-4 border-b border-emerald-500/20">
                <CardTitle className="text-2xl font-bold text-emerald-100">Policy Details</CardTitle>
                <CardDescription className="text-slate-300">Fill in your crop information to get instant premium</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="crop-type" className="font-semibold text-emerald-200">Crop Type *</Label>
                  <Select onValueChange={handleCropChange}>
                    <SelectTrigger id="crop-type" className="py-6 bg-slate-800/50 border border-emerald-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/50">
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border border-emerald-500/30">
                      <SelectItem value="Rice">🍚 Rice</SelectItem>
                      <SelectItem value="Wheat">🌾 Wheat</SelectItem>
                      <SelectItem value="Cotton">🟤 Cotton</SelectItem>
                      <SelectItem value="Sugarcane">🍯 Sugarcane</SelectItem>
                      <SelectItem value="Maize">🌽 Maize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="season" className="font-semibold text-emerald-200">Season *</Label>
                  <Select onValueChange={handleSeasonChange}>
                    <SelectTrigger id="season" className="py-6 bg-slate-800/50 border border-emerald-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/50">
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border border-emerald-500/30">
                      <SelectItem value="Kharif">☔ Kharif (Monsoon)</SelectItem>
                      <SelectItem value="Rabi">❄️ Rabi (Winter)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="land-area" className="font-semibold text-emerald-200">Land Area (Acres)</Label>
                  <Input
                    id="land-area"
                    value={landArea}
                    disabled
                    className="bg-slate-800/30 py-6 border border-emerald-500/20 text-slate-300 font-medium rounded-lg"/>
                  <p className="text-xs text-emerald-300/80 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Auto-filled from your profile
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-2xl bg-slate-900/80 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
              <CardHeader className="pb-4 border-b border-emerald-500/20">
                <CardTitle className="text-xl font-bold text-emerald-100">Coverage Includes</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    <span className="font-medium text-emerald-200">Flood Damage</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    <span className="font-medium text-emerald-200">Drought</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    <span className="font-medium text-emerald-200">Pest Attack</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    <span className="font-medium text-emerald-200">Cyclone</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    <span className="font-medium text-emerald-200">Fire</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    <span className="font-medium text-emerald-200">Hailstorm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="backdrop-blur-2xl bg-gradient-to-br from-emerald-950/80 to-green-950/80 border-2 border-emerald-400/40 shadow-2xl shadow-emerald-500/30 sticky top-8 hover:border-emerald-400/60 hover:shadow-emerald-500/40 transition-all duration-300">
              <CardHeader className="pb-4 border-b border-emerald-500/30">
                <CardTitle className="text-xl font-bold text-emerald-100">Premium Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div className="space-y-3 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-300 font-medium">Crop:</span>
                    <Badge className="bg-emerald-600 text-emerald-50 hover:bg-emerald-700">{cropType || "Not selected"}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-300 font-medium">Season:</span>
                    <Badge className="bg-cyan-600 text-cyan-50 hover:bg-cyan-700">{season || "Not selected"}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-300 font-medium">Land Area:</span>
                    <span className="font-bold text-emerald-100">{landArea} acres</span>
                  </div>
                </div>

                <div className="border-t border-emerald-500/30 pt-4">
                  <div className="mb-2">
                    <p className="text-sm text-emerald-300/80 font-medium mb-1">Total Premium:</p>
                    <p className="text-4xl font-bold text-emerald-300">₹{premium.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-emerald-400/60">Per season</p>
                </div>

                <Button 
                  onClick={handleProceedToPayment} 
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 text-base"
                  disabled={!cropType || !season}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Payment
                </Button>

                <p className="text-xs text-center text-emerald-400/70 font-medium">
                  🔒 Secured payment gateway
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyPolicy;
