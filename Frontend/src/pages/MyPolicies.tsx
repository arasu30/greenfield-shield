import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Calendar, DollarSign, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

const MyPolicies = () => {
    const navigate = useNavigate();
    const [policies, setPolicies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) { navigate("/login"); return; }
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/farmer/my-policies`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setPolicies(await res.json());
                else throw new Error("Failed to fetch");
            } catch (err) { console.error(err); toast.error("Could not load policies"); }
            finally { setIsLoading(false); }
        };
        fetchPolicies();
    }, [navigate]);

    const getStatusStyle = (status: string) => {
        if (status === "Active") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
        if (status === "Expired") return "bg-slate-500/15 text-slate-400 border-slate-500/20";
        return "bg-amber-500/15 text-amber-400 border-amber-500/20";
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">My Policies</h1>
                    <p className="page-subtitle">Manage your active crop insurance policies</p>
                </div>
                <Button onClick={() => navigate("/dashboard/buy-policy")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg h-10 px-5 shadow-lg shadow-emerald-600/20">
                    <ShieldCheck className="w-4 h-4 mr-2" /> New Policy
                </Button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-3" />
                    <p className="text-sm">Loading policies...</p>
                </div>
            ) : policies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {policies.map((policy: any) => (
                        <Card key={policy.id} className="glass-card-hover rounded-xl group">
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{policy.crop_type}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{policy.season} • #{policy.id}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`text-xs ${getStatusStyle(policy.status)}`}>{policy.status}</Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/[0.03] rounded-lg p-3">
                                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                                            <DollarSign className="w-3 h-3" />
                                            <span className="text-[10px] font-medium uppercase tracking-wider">Premium</span>
                                        </div>
                                        <p className="text-sm font-semibold text-white">₹{policy.premium?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-white/[0.03] rounded-lg p-3">
                                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                                            <ShieldCheck className="w-3 h-3" />
                                            <span className="text-[10px] font-medium uppercase tracking-wider">Coverage</span>
                                        </div>
                                        <p className="text-sm font-semibold text-white">₹{policy.coverage?.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-white/[0.04]">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(policy.start_date).toLocaleDateString()} – {new Date(policy.end_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="glass-card rounded-2xl flex flex-col items-center justify-center py-16 text-center">
                    <FileText className="w-12 h-12 text-slate-700 mb-4" />
                    <h3 className="text-lg font-medium text-slate-300 mb-1">No policies yet</h3>
                    <p className="text-sm text-slate-600 mb-5">Protect your crops with our AI-powered insurance</p>
                    <Button onClick={() => navigate("/dashboard/buy-policy")} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                        Buy Your First Policy
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MyPolicies;
