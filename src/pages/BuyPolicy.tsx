import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100 dark:from-slate-950 dark:via-green-950 dark:to-slate-900">
      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-8 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-10">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-3">Buy Insurance Policy</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">Protect your crops with comprehensive AI-powered coverage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Policy Details</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">Fill in your crop information to get instant premium</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="crop-type" className="font-semibold text-slate-700 dark:text-slate-200">Crop Type *</Label>
                  <Select onValueChange={handleCropChange}>
                    <SelectTrigger id="crop-type" className="py-6 text-base border-slate-200 dark:border-slate-700 rounded-lg">
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="Rice">🍚 Rice</SelectItem>
                      <SelectItem value="Wheat">🌾 Wheat</SelectItem>
                      <SelectItem value="Cotton">🟤 Cotton</SelectItem>
                      <SelectItem value="Sugarcane">🍯 Sugarcane</SelectItem>
                      <SelectItem value="Maize">🌽 Maize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="season" className="font-semibold text-slate-700 dark:text-slate-200">Season *</Label>
                  <Select onValueChange={handleSeasonChange}>
                    <SelectTrigger id="season" className="py-6 text-base border-slate-200 dark:border-slate-700 rounded-lg">
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="Kharif">☔ Kharif (Monsoon)</SelectItem>
                      <SelectItem value="Rabi">❄️ Rabi (Winter)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="land-area" className="font-semibold text-slate-700 dark:text-slate-200">Land Area (Acres)</Label>
                  <Input
                    id="land-area"
                    value={landArea}
                    disabled
                    className="bg-slate-100 dark:bg-slate-800 py-6 text-base border-slate-200 dark:border-slate-700 font-medium rounded-lg"/>
                  <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Auto-filled from your profile
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-900 border-green-200 dark:border-emerald-800 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-green-900 dark:text-emerald-100">Coverage Includes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4\">
                  <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-900/50 rounded-lg\">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500\"></div>
                    <span className="font-medium text-slate-700 dark:text-slate-200\">Flood Damage</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-900/50 rounded-lg\">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500\"></div>
                    <span className="font-medium text-slate-700 dark:text-slate-200\">Drought</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-900/50 rounded-lg\">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500\"></div>
                    <span className="font-medium text-slate-700 dark:text-slate-200\">Pest Attack</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-900/50 rounded-lg\">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500\"></div>
                    <span className="font-medium text-slate-700 dark:text-slate-200\">Cyclone</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-900/50 rounded-lg\">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500\"></div>
                    <span className="font-medium text-slate-700 dark:text-slate-200\">Fire</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-900/50 rounded-lg\">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500\"></div>
                    <span className="font-medium text-slate-700 dark:text-slate-200\">Hailstorm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 border-2 border-green-300 dark:border-emerald-700 shadow-xl sticky top-8 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-green-900 dark:text-emerald-50">Premium Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3 bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Crop:</span>
                    <Badge className="bg-green-200 text-green-900 dark:bg-green-700 dark:text-green-50">{cropType || "Not selected"}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Season:</span>
                    <Badge className="bg-blue-200 text-blue-900 dark:bg-blue-700 dark:text-blue-50">{season || "Not selected"}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Land Area:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{landArea} acres</span>
                  </div>
                </div>

                <div className="border-t-2 border-green-300 dark:border-emerald-700 pt-4">
                  <div className="mb-2">
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-1">Total Premium:</p>
                    <p className="text-4xl font-bold text-green-600 dark:text-emerald-300">₹{premium.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Per season</p>
                </div>

                <Button 
                  onClick={handleProceedToPayment} 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-base"
                  disabled={!cropType || !season}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Payment
                </Button>

                <p className="text-xs text-center text-slate-600 dark:text-slate-400 font-medium">
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
