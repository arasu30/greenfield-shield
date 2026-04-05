import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, AlertCircle, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/LanguageContext";

const ClaimDamage = () => {
    const navigate = useNavigate();
    const [policies, setPolicies] = useState<any[]>([]);
    const [selectedPolicyId, setSelectedPolicyId] = useState("");
    const [disasterType, setDisasterType] = useState("");
    const [date, setDate] = useState("");
    const [affectedArea, setAffectedArea] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingPolicies, setIsFetchingPolicies] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/farmer/my-policies`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPolicies(data.filter((p: any) => p.status === "Active"));
                }
            } catch (err) { console.error(err); }
            finally { setIsFetchingPolicies(false); }
        };
        fetchPolicies();
    }, []);

    const handleSubmit = async () => {
        if (!selectedPolicyId || !disasterType || !date || !affectedArea) { 
            toast.error("Please fill all required fields"); return; 
        }
        
        const selectedPolicy = policies.find(p => p.id.toString() === selectedPolicyId);
        
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const formData = new FormData();
            formData.append('policy_id', selectedPolicyId);
            formData.append('crop_type', selectedPolicy?.crop_type || "Unknown");
            formData.append('disaster_type', disasterType);
            formData.append('affected_area', affectedArea);
            formData.append('description', description);
            
            if (files) {
                Array.from(files).forEach(file => {
                    formData.append('files', file);
                });
            }

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/farmer/create-claim`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`
                    // Content-Type is set automatically for FormData
                },
                body: formData
            });
            
            if (!res.ok) throw new Error("Failed to submit claim");
            
            toast.success("Claim submitted successfully!");
            toast.info("AI analysis in progress. You'll receive updates soon.");
            setTimeout(() => { navigate("/dashboard/my-policies"); }, 2000);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "h-11 bg-white/[0.03] border-white/[0.08] text-slate-100 placeholder-slate-600 focus:border-emerald-500/40 rounded-lg";

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
            <div>
                <h1 className="page-title">{t("claim.title")}</h1>
                <p className="page-subtitle">{t("claim.desc")}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="glass-card rounded-xl">
                        <CardHeader className="pb-4 border-b border-white/[0.06]">
                            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-400" /> {t("claim.damageDetails")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">{t("claim.selectPolicy")}</Label>
                                <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId}>
                                    <SelectTrigger className={inputClass}>
                                        <SelectValue placeholder={isFetchingPolicies ? "Loading policies..." : t("claim.choosePolicy")} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#151d35] border-white/[0.08] text-slate-200">
                                        {policies.length > 0 ? (
                                            policies.map(p => (
                                                <SelectItem key={p.id} value={p.id.toString()}>
                                                    #{p.id} - {p.crop_type} ({p.season})
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="none" disabled>No active policies found</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">{t("claim.distress")}</Label>
                                <Select onValueChange={setDisasterType}>
                                    <SelectTrigger className={inputClass}><SelectValue placeholder="Select disaster type" /></SelectTrigger>
                                    <SelectContent className="bg-[#151d35] border-white/[0.08] text-slate-200">
                                        <SelectItem value="Flood">💧 Flood</SelectItem>
                                        <SelectItem value="Drought">🏜️ Drought</SelectItem>
                                        <SelectItem value="Pest Attack">🐛 Pest Attack</SelectItem>
                                        <SelectItem value="Cyclone">🌪️ Cyclone</SelectItem>
                                        <SelectItem value="Hailstorm">❄️ Hailstorm</SelectItem>
                                        <SelectItem value="Fire">🔥 Fire</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">{t("claim.date")}</Label>
                                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">{t("claim.affectedArea")}</Label>
                                <Input type="number" step="0.1" placeholder="Enter affected area" value={affectedArea} onChange={(e) => setAffectedArea(e.target.value)} className={inputClass} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">{t("claim.description")}</Label>
                                <Textarea placeholder="Describe the damage in detail..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                                    className="bg-white/[0.03] border-white/[0.08] text-slate-100 placeholder-slate-600 focus:border-emerald-500/40 rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">{t("claim.uploadPhotos")}</Label>
                                <div className="border border-dashed border-white/[0.1] rounded-lg p-6 text-center hover:border-white/[0.2] transition-colors cursor-pointer bg-white/[0.02]">
                                    <input id="photos" type="file" multiple accept="image/*" className="hidden" onChange={(e) => setFiles(e.target.files)} />
                                    <label htmlFor="photos" className="cursor-pointer">
                                        <Upload className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                                        <p className="text-sm text-slate-400">{t("claim.uploadHint")}</p>
                                        <p className="text-xs text-slate-600 mt-1">PNG, JPG up to 10MB each</p>
                                        {files && <p className="text-xs text-emerald-400 mt-2">{files.length} file(s) selected</p>}
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-5">
                    <Card className="glass-card rounded-xl">
                        <CardHeader className="pb-3 border-b border-white/[0.06]">
                            <CardTitle className="text-sm font-medium text-amber-400 flex items-center gap-2">
                                <Info className="w-4 h-4" /> {t("claim.important")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2 text-xs text-slate-400">
                            <p>• {t("claim.hint1")}</p>
                            <p>• {t("claim.hint2")}</p>
                            <p>• {t("claim.hint3")}</p>
                            <p>• {t("claim.hint4")}</p>
                            <p>• {t("claim.hint5")}</p>
                        </CardContent>
                    </Card>

                    <Card className="glass-card rounded-xl">
                        <CardHeader className="pb-3 border-b border-white/[0.06]">
                            <CardTitle className="text-sm font-medium text-slate-300">{t("claim.next")}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {[t("claim.step1"), t("claim.step2"), t("claim.step3")].map((step, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-[10px] font-semibold text-slate-400">{i + 1}</span>
                                    </div>
                                    <p className="text-xs text-slate-400">{step}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Button onClick={handleSubmit} disabled={isLoading} className="w-full bg-amber-600 hover:bg-amber-500 text-white h-11 font-medium rounded-lg shadow-lg shadow-amber-600/20">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("claim.submit")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ClaimDamage;
