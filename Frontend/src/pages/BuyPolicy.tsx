import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Loader2, Globe, Map, FileText, CheckCircle, Info, Lock, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

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

interface Scheme {
    id: number;
    name: string;
    required_documents: string;
}

interface Farm {
    id: number;
    name: string;
    area: number;
    crop_type: string;
}

interface PremiumQuote {
    premium: number;
    coverage: number;
    market_total: number;
    subsidy_amount: number;
    has_subsidy: boolean;
}

const BuyPolicy = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const schemeId = searchParams.get("schemeId");
    
    const [cropType, setCropType] = useState(searchParams.get("cropType") || "");
    const [season, setSeason] = useState("");
    const [area, setArea] = useState("");
    
    const [farms, setFarms] = useState<Farm[]>([]);
    const [selectedFarmId, setSelectedFarmId] = useState<string>("");
    
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
    const [proofsData, setProofsData] = useState<Record<string, string>>({});
    const [detectedBank, setDetectedBank] = useState<string>("");
    
    const [isCalculating, setIsCalculating] = useState(false);
    const [premium, setPremium] = useState<PremiumQuote | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const { t, lang } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) { navigate("/login"); return; }

                const headers = { 'Authorization': `Bearer ${token}` };
                const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

                const handleUnauthorized = () => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    toast.error("Session expired. Please login again.");
                    navigate("/login");
                };

                // Fetch Schemes
                const schemeRes = await fetch(`${baseUrl}/schemes`, { headers });
                if (schemeRes.status === 401) { handleUnauthorized(); return; }
                if (schemeRes.ok) {
                    const schemesData = await schemeRes.json();
                    setSchemes(schemesData);
                    if (schemeId) {
                        const s = schemesData.find((item: Scheme) => item.id === parseInt(schemeId));
                        if (s) setSelectedScheme(s);
                    }
                }

                // Fetch Farmer's Farms
                const farmRes = await fetch(`${baseUrl}/farmer/farms`, { headers });
                if (farmRes.status === 401) { handleUnauthorized(); return; }
                if (farmRes.ok) {
                    setFarms(await farmRes.json());
                }
            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, [navigate, schemeId]);

    const handleFarmSelect = (id: string) => {
        setSelectedFarmId(id);
        const farm = farms.find(f => f.id.toString() === id);
        if (farm) {
            setArea(farm.area.toString());
            if (farm.crop_type) setCropType(farm.crop_type);
            toast.success(`Fetched data from ${farm.name}`);
        }
    };

    const handleProofInputChange = (doc: string, value: string) => {
        setProofsData(prev => ({ ...prev, [doc]: value }));

        // Mock IFSC Bank Detection
        if (doc === 'IFSC Code' && value.length >= 4) {
            const code = value.substring(0, 4).toUpperCase();
            const banks: Record<string, string> = {
                'SBIN': 'State Bank of India',
                'HDFC': 'HDFC Bank',
                'ICIC': 'ICICI Bank',
                'BARB': 'Bank of Baroda',
                'PUNB': 'Punjab National Bank'
            };
            setDetectedBank(banks[code] || "Verified Bank");
        } else if (doc === 'IFSC Code') {
            setDetectedBank("");
        }
    };

    const requiredDocs = ["Aadhaar (Last 4 digits)", "Account Number", "IFSC Code"];
    const requiresSchemeDocuments = Boolean(selectedScheme);
    const isDocsComplete = Boolean(selectedFarmId) && (
        !requiresSchemeDocuments || (
            requiredDocs.every(doc => proofsData[doc] && proofsData[doc].trim().length > 0) &&
            (proofsData["Aadhaar (Last 4 digits)"]?.length === 4)
        )
    );

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
            
            const marketData = await res.json();

            const SUBSIDY_PERCENT = 0.90;
            const hasSubsidy = Boolean(selectedScheme);
            const subsidyAmount = hasSubsidy ? Math.round(marketData.premium * SUBSIDY_PERCENT) : 0;
            const finalPremium = hasSubsidy ? Math.round(marketData.premium - subsidyAmount) : marketData.premium;

            setPremium({ 
                premium: finalPremium,
                coverage: marketData.coverage,
                market_total: marketData.premium,
                subsidy_amount: subsidyAmount,
                has_subsidy: hasSubsidy
            });
            
            toast.success(
                hasSubsidy
                    ? `Subsidized quote generated for ${area} Acres`
                    : `Quote generated for ${area} Acres`
            );
        } catch (err: any) { toast.error(err.message); }
        finally { setIsCalculating(false); }
    };

    const handlePurchase = async () => {
        if (!premium) return;
        if (!isDocsComplete) {
            toast.error(
                requiresSchemeDocuments
                    ? "Please complete all documentation fields to proceed."
                    : "Please select a registered farm to proceed."
            );
            return;
        }

        setIsProcessing(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/farmer/create-payment-intent`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    crop_type: cropType, 
                    season, 
                    area_acres: parseFloat(area), 
                    premium: premium.premium, 
                    coverage: premium.coverage,
                    scheme_id: selectedScheme ? selectedScheme.id : null,
                    proofs: selectedScheme ? proofsData : null
                }),
            });
            if (!res.ok) throw new Error("Failed to create payment");
            const data = await res.json();
            
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
                        scheme_id: selectedScheme ? selectedScheme.id : null,
                        proofs: selectedScheme ? proofsData : null
                    }
                } 
            });
        } catch (err: any) { toast.error(err.message); }
        finally { setIsProcessing(false); }
    };

    const inputClass = "h-11 bg-white/[0.03] border-white/[0.08] text-slate-100 placeholder-slate-600 focus:border-emerald-500/40 rounded-lg";

    if (isLoadingData) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p>Preparing policy wizard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
            <div>
                <h1 className="page-title">
                    {selectedScheme ? t("buy.applyScheme") : t("buy.title")}
                </h1>
                <p className="page-subtitle">
                    {selectedScheme 
                        ? `Applying for: ${selectedScheme.name}` 
                        : t("buy.desc")}
                </p>
            </div>

            {!selectedScheme && (
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <Info className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white">{t("buy.savePremium")}</h4>
                            <p className="text-xs text-slate-400">{t("buy.savePremiumDesc")}</p>
                        </div>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate("/dashboard/schemes")}
                        className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-xs font-medium"
                    >
                        {t("buy.viewSchemes")}
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Card 1: Land Records */}
                    <Card className="glass-card rounded-xl border-emerald-500/10">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                <Map className="w-5 h-5 text-emerald-400" /> {t("buy.landRecords")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4">
                            <div className="space-y-2 animate-in fade-in duration-300">
                                <Label className="text-slate-400 text-sm">{t("buy.selectFarm")}</Label>
                                <Select value={selectedFarmId} onValueChange={handleFarmSelect}>
                                    <SelectTrigger className={inputClass}>
                                        <SelectValue placeholder={farms.length > 0 ? t("buy.selectFarm") : t("buy.noMapped")} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#151d35] border-white/[0.08] text-slate-200">
                                        {farms.map(f => (
                                            <SelectItem key={f.id} value={f.id.toString()}>
                                                {f.name} ({f.area.toFixed(2)} Acres)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {farms.length === 0 ? (
                                    <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 mt-2">
                                        <p className="text-[11px] text-amber-500/70 italic flex items-center gap-1.5 leading-relaxed">
                                            <Info className="w-3.5 h-3.5" /> 
                                            {t("buy.noRegistered")} <strong>{t("buy.cropsureApp")}</strong> {t("buy.beforeBuying")}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                                        {t("buy.dataVerified")}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Documentation Vault (RELOCATED FROM SIDEBAR) */}
                    {selectedScheme && (
                        <Card className="glass-card rounded-2xl border-emerald-500/10 shadow-2xl shadow-emerald-500/5 transition-all">
                            <CardHeader className="pb-4 border-b border-white/[0.06]">
                                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-400" /> {t("buy.docVault")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Identity Verification */}
                                    <div className="space-y-4">
                                        <Label className="text-slate-400 text-sm">{t("buy.identity")}</Label>
                                        <div className="group space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-[11px] font-semibold text-slate-500 group-focus-within:text-emerald-400 transition-colors">{t("buy.aadhaar")}</Label>
                                                {proofsData["Aadhaar (Last 4 digits)"]?.length === 4 && <CheckCircle className="w-3 h-3 text-emerald-500 animate-in zoom-in" />}
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                                                <Input 
                                                    maxLength={4}
                                                    placeholder="0000"
                                                    value={proofsData["Aadhaar (Last 4 digits)"] || ""}
                                                    onChange={(e) => handleProofInputChange("Aadhaar (Last 4 digits)", e.target.value.replace(/\D/g, ''))}
                                                    className="pl-10 h-11 text-sm bg-white/[0.02] border-white/10 rounded-xl"
                                                />
                                            </div>
                                            <p className="text-[9px] text-slate-600 flex items-center gap-1">
                                                <ShieldCheck className="w-2.5 h-2.5" /> {t("buy.secureData")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bank Details */}
                                    <div className="space-y-4">
                                        <Label className="text-slate-400 text-sm">{t("buy.bankDetails")}</Label>
                                        <div className="space-y-3">
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-semibold text-slate-500">{t("buy.accNo")}</Label>
                                                <Input 
                                                    placeholder="Enter your account number"
                                                    value={proofsData["Account Number"] || ""}
                                                    onChange={(e) => handleProofInputChange("Account Number", e.target.value.replace(/\D/g, ''))}
                                                    className="h-11 text-sm bg-white/[0.02] border-white/10 rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-semibold text-slate-500">{t("buy.ifsc")}</Label>
                                                <Input 
                                                    placeholder="e.g. SBIN0001234"
                                                    value={proofsData["IFSC Code"] || ""}
                                                    onChange={(e) => handleProofInputChange("IFSC Code", e.target.value.toUpperCase())}
                                                    className="h-11 text-sm bg-white/[0.02] border-white/10 rounded-xl"
                                                />
                                                {detectedBank && <p className="text-[9px] font-bold text-emerald-400 px-1">{detectedBank}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Card 3: Policy Details */}
                    <Card className="glass-card rounded-xl">
                        <CardHeader className="pb-4 border-b border-white/[0.06]">
                            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" /> {t("buy.policyDetails")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-sm">{t("buy.cropType")}</Label>
                                    <Select value={cropType} onValueChange={setCropType}>
                                        <SelectTrigger className={inputClass}><SelectValue placeholder={t("addFarm.selectCrop")} /></SelectTrigger>
                                        <SelectContent className="bg-[#151d35] border-white/[0.08] text-slate-200">
                                            {CROP_OPTIONS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-sm">{t("buy.season")}</Label>
                                    <Select value={season} onValueChange={setSeason}>
                                        <SelectTrigger className={inputClass}><SelectValue placeholder="Select season" /></SelectTrigger>
                                        <SelectContent className="bg-[#151d35] border-white/[0.08] text-slate-200">
                                            {SEASON_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">{t("buy.area")}</Label>
                                <Input 
                                    type="number" 
                                    step="0.1" 
                                    placeholder={t("buy.area")}
                                    value={area} 
                                    disabled
                                    className={cn(inputClass, "bg-white/[0.01] border-emerald-500/20 text-emerald-400 cursor-not-allowed")} 
                                />
                            </div>

                            <Button onClick={handleCalculate} disabled={isCalculating}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 font-medium rounded-lg shadow-lg shadow-emerald-600/20">
                                {isCalculating ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Calculating...</>) : t("buy.checkPremium")}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">

                    {/* Summary */}
                    <Card className="glass-card rounded-xl border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                        <CardHeader className="pb-3 border-b border-white/[0.06]">
                            <CardTitle className="text-sm font-medium text-slate-400 flex items-center justify-between">
                                {t("buy.summary")}
                                {selectedScheme && (
                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                        {t("buy.subsidized")}
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {premium ? (
                                <>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">{t("buy.marketCost")}</span>
                                            <span className={cn("text-slate-300", premium.has_subsidy && "line-through")}>
                                                ₹{premium.market_total.toLocaleString()}
                                            </span>
                                        </div>
                                        {premium.has_subsidy && (
                                            <>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-emerald-500 font-medium italic">{t("buy.govtSubsidy")}</span>
                                                    <span className="text-emerald-500">-₹{premium.subsidy_amount.toLocaleString()}</span>
                                                </div>
                                                <div className="h-px bg-white/[0.06]" />
                                            </>
                                        )}
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                                                {premium.has_subsidy ? t("buy.yourPremium") : t("buy.marketCost")}
                                            </p>
                                            <p className="text-4xl font-bold text-emerald-400">₹{premium.premium.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1 bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{t("buy.coverage")}</p>
                                        <p className="text-xl font-semibold text-white">₹{premium.coverage.toLocaleString()}</p>
                                        <p className="text-[9px] text-slate-600 mt-1">{t("buy.coverageDesc")}</p>
                                    </div>
                                    
                                    <Button 
                                        onClick={handlePurchase} 
                                        disabled={isProcessing || !isDocsComplete}
                                        className={cn(
                                            "w-full h-12 font-semibold rounded-lg shadow-lg transition-all",
                                            isDocsComplete 
                                                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30" 
                                                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 shadow-none"
                                        )}
                                    >
                                        {isProcessing ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                                        ) : (
                                            t("buy.pay")
                                        )}
                                    </Button>
                                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                                        <ShieldCheck className="w-3 h-3" /> {t("buy.securePayment")}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 space-y-3">
                                    <Globe className="w-10 h-10 text-slate-700 mx-auto opacity-20" />
                                    <p className="text-sm text-slate-600">Please complete the land details to generate your quote</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BuyPolicy;
