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
    <div className="min-h-screen bg-muted/30">
      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Buy Insurance Policy</h2>
          <p className="text-muted-foreground">Protect your crops with comprehensive coverage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Policy Details</CardTitle>
                <CardDescription>Fill in your crop information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="crop-type">Crop Type *</Label>
                  <Select onValueChange={handleCropChange}>
                    <SelectTrigger id="crop-type">
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="Rice">Rice</SelectItem>
                      <SelectItem value="Wheat">Wheat</SelectItem>
                      <SelectItem value="Cotton">Cotton</SelectItem>
                      <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                      <SelectItem value="Maize">Maize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="season">Season *</Label>
                  <Select onValueChange={handleSeasonChange}>
                    <SelectTrigger id="season">
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="Kharif">Kharif (Monsoon)</SelectItem>
                      <SelectItem value="Rabi">Rabi (Winter)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="land-area">Land Area (Acres)</Label>
                  <Input
                    id="land-area"
                    value={landArea}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Auto-filled from your profile
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle>Coverage Includes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Flood Damage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Drought</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Pest Attack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Cyclone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Fire</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Hailstorm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Premium Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Crop:</span>
                    <Badge variant="secondary">{cropType || "Not selected"}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Season:</span>
                    <Badge variant="secondary">{season || "Not selected"}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Land Area:</span>
                    <span className="font-medium">{landArea} acres</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Premium:</span>
                    <span className="text-2xl font-bold text-primary">₹{premium.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Per season</p>
                </div>

                <Button 
                  onClick={handleProceedToPayment} 
                  className="w-full"
                  disabled={!cropType || !season}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Payment
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secured payment gateway
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
