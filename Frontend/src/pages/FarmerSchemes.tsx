import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, FileText, Gift, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Scheme {
    id: number;
    name: string;
    description: string;
    eligibility_criteria: string;
    benefits: string;
    required_documents: string;
    is_active: boolean;
}

const FarmerSchemes = () => {
    const navigate = useNavigate();
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) { navigate("/login"); return; }
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/schemes`, {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });
                if (!response.ok) throw new Error("Failed to fetch schemes");
                setSchemes(await response.json());
            } catch (error) { console.error("Fetch error:", error); toast.error("Could not load government schemes"); }
            finally { setIsLoading(false); }
        };
        fetchSchemes();
    }, [navigate]);

    const handleApply = (schemeId: number, schemeName: string) => {
        toast.info(`Applying for ${schemeName}...`);
        navigate(`/dashboard/buy-policy?schemeId=${schemeId}&schemeName=${encodeURIComponent(schemeName)}`);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
            <div>
                <h1 className="page-title">Govt Schemes & Subsidies</h1>
                <p className="page-subtitle">Discover and apply for agricultural initiatives</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-3" />
                    <p className="text-sm">Loading schemes...</p>
                </div>
            ) : schemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {schemes.map((scheme) => (
                        <Card key={scheme.id} className="glass-card-hover rounded-xl group flex flex-col">
                            <CardHeader className="pb-4 border-b border-white/[0.06]">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <BookOpen className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <CardTitle className="text-base font-semibold text-white leading-tight">{scheme.name}</CardTitle>
                                    </div>
                                    <Badge variant="outline" className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/20">Open</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 flex-1 flex flex-col">
                                <p className="text-sm text-slate-400 leading-relaxed mb-5">{scheme.description}</p>

                                <div className="space-y-3 mb-6 flex-1">
                                    {scheme.benefits && (
                                        <div className="flex items-start gap-2.5">
                                            <Gift className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-medium text-blue-400 uppercase tracking-wider mb-0.5">Benefits</p>
                                                <p className="text-xs text-slate-300">{scheme.benefits}</p>
                                            </div>
                                        </div>
                                    )}
                                    {scheme.eligibility_criteria && (
                                        <div className="flex items-start gap-2.5">
                                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider mb-0.5">Eligibility</p>
                                                <p className="text-xs text-slate-300">{scheme.eligibility_criteria}</p>
                                            </div>
                                        </div>
                                    )}
                                    {scheme.required_documents && (
                                        <div className="flex items-start gap-2.5">
                                            <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-medium text-amber-400 uppercase tracking-wider mb-0.5">Documents</p>
                                                <p className="text-xs text-slate-300">{scheme.required_documents}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button onClick={() => handleApply(scheme.id, scheme.name)}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg h-10 shadow-lg shadow-emerald-600/20 mt-auto">
                                    Apply Now
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="glass-card rounded-2xl flex flex-col items-center justify-center py-16 text-center">
                    <Info className="w-12 h-12 text-slate-700 mb-4" />
                    <h3 className="text-lg font-medium text-slate-300 mb-1">No Schemes Available</h3>
                    <p className="text-sm text-slate-600">Check back later for new government schemes.</p>
                </div>
            )}
        </div>
    );
};

export default FarmerSchemes;
