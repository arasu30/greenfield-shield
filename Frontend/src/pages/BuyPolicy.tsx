import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CROP_OPTIONS = [
    { value: "Rice", label: "Rice" },
    { value: "Wheat", label: "Wheat" },
    { value: "Cotton", label: "Cotton" },
    { value: "Sugarcane", label: "Sugarcane" },
    { value: "Maize", label: "Maize" },
    { value: "Soybean", label: "Soybean" },
];

const SEASON_OPTIONS = [
    { value: "Kharif", label: "Kharif (Jun-Oct)" },
    { value: "Rabi", label: "Rabi (Nov-Mar)" },
    { value: "Zaid", label: "Zaid (Mar-Jun)" },
];

const BuyPolicy = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [cropType, setCropType] = useState(searchParams.get("cropType") || "");
    const schemeId = searchParams.get("schemeId");
    const [season, setSeason] = useState("");
    const [area, setArea] = useState("");
    const [isCalculating, setIsCalculating] = useState(false);
    const [premium, setPremium] = useState<{ premium: number; coverage: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCalculate = async () => {
        if (!cropType || !season || !area) { toast.error("Please fill all fields"); return; }
        setIsCalculating(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/farmer/calculate-premium`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ crop_type: cropType, season, area_acres: parseFloat(area) }),
            });
            if (!res.ok) throw new Error("Calculation failed");
            setPremium(await res.json());
        } catch (err: any) { toast.error(err.message); }
        finally { setIsCalculating(false); }
    };

    const handlePurchase = async () => {
        if (!premium) return;
        setIsProcessing(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/farmer/create-payment-intent`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ crop_type: cropType, season, area_acres: parseFloat(area), premium: premium.premium, coverage: premium.coverage }),
            });
            if (!res.ok) throw new Error("Failed to create payment");
            const data = await res.json();
            
            // Navigate to payment page instead of setting local state
            navigate("/dashboard/payment", { 
                state: { 
                    clientSecret: data.client_secret, 
                    amount: premium.premium,
                    policyDetails: {
                        crop_type: cropType,
                        season,
                        area_acres: parseFloat(area),
                        premium: premium.premium,
                        coverage: premium.coverage,
                        scheme_id: schemeId ? parseInt(schemeId) : null
                    }
                } 
            });
        } catch (err: any) { toast.error(err.message); }
        finally { setIsProcessing(false); }
    };

    const inputClass = "h-11 bg-white/[0.03] border-white/[0.08] text-slate-100 placeholder-slate-600 focus:border-emerald-500/40 rounded-lg";

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
            <div>
                <h1 className="page-title">Buy Insurance Policy</h1>
                <p className="page-subtitle">Protect your crops with AI-powered insurance coverage</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-2">
                    <Card className="glass-card rounded-xl">
                        <CardHeader className="pb-4 border-b border-white/[0.06]">
                            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Policy Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">Crop Type</Label>
                                <Select value={cropType} onValueChange={setCropType}>
                                    <SelectTrigger className={inputClass}><SelectValue placeholder="Select crop type" /></SelectTrigger>
                                    <SelectContent className="bg-[#151d35] border-white/[0.08] text-slate-200">
                                        {CROP_OPTIONS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">Season</Label>
                                <Select value={season} onValueChange={setSeason}>
                                    <SelectTrigger className={inputClass}><SelectValue placeholder="Select season" /></SelectTrigger>
                                    <SelectContent className="bg-[#151d35] border-white/[0.08] text-slate-200">
                                        {SEASON_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">Area (Acres)</Label>
                                <Input type="number" step="0.1" placeholder="Enter area in acres" value={area} onChange={(e) => setArea(e.target.value)} className={inputClass} />
                            </div>
                            <Button onClick={handleCalculate} disabled={isCalculating}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 font-medium rounded-lg shadow-lg shadow-emerald-600/20">
                                {isCalculating ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Calculating...</>) : "Calculate Premium"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary */}
                <div className="space-y-5">
                    <Card className="glass-card rounded-xl">
                        <CardHeader className="pb-3 border-b border-white/[0.06]">
                            <CardTitle className="text-sm font-medium text-slate-400">Premium Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            {premium ? (
                                <>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Annual Premium</p>
                                        <p className="text-3xl font-semibold text-emerald-400">₹{premium.premium.toLocaleString()}</p>
                                    </div>
                                    <div className="h-px bg-white/[0.06]" />
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Coverage Amount</p>
                                        <p className="text-xl font-semibold text-white">₹{premium.coverage.toLocaleString()}</p>
                                    </div>
                                    <Button onClick={handlePurchase} disabled={isProcessing}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-10 font-medium rounded-lg text-sm">
                                        {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>) : "Proceed to Payment"}
                                    </Button>
                                </>
                            ) : (
                                <p className="text-sm text-slate-600 text-center py-6">Fill the form and calculate your premium</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BuyPolicy;
