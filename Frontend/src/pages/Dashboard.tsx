import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ShieldCheck, FileText, AlertTriangle, Satellite, Sprout, ArrowRight,
    TrendingUp, Wallet, Leaf, BookOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LocationMap } from "@/components/LocationMap";
import { toast } from "sonner";
import { AddFarmModal } from "@/components/AddFarmModal";
import { Plus } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any[]>([]);
    const [farms, setFarms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) { navigate("/login"); return; }
            
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/farmer/dashboard-stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401) {
                console.warn("Session expired or token invalid. Redirecting to login...");
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                toast.error("Session expired. Please login again.");
                navigate("/login");
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setStats(data.stats || []);
                setFarms(data.farms || []);
            }
        } catch (err) { 
            console.error("Failed to fetch dashboard data:", err); 
        } finally {
            setIsLoading(false);
        }
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'ShieldCheck': return ShieldCheck;
            case 'Wallet': return Wallet;
            case 'FileText': return FileText;
            case 'TrendingUp': return TrendingUp;
            case 'AlertTriangle': return AlertTriangle;
            default: return Sprout;
        }
    };

    return (
        <div className="space-y-8 animate-fade-up">
            <AddFarmModal 
                isOpen={isAddFarmOpen} 
                onClose={() => setIsAddFarmOpen(false)} 
                onSuccess={fetchDashboardData} 
            />

            {/* Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="page-title">{t("dash.welcome")}, {user?.full_name?.split(' ')[0] || 'Farmer'}</h1>
                    <p className="page-subtitle">{t("dash.overview")}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button 
                        onClick={() => setIsAddFarmOpen(true)} 
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/10 font-medium rounded-lg h-10 px-6 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> {t("dash.addFarm")}
                    </Button>
                    <Button onClick={() => navigate("/dashboard/buy-policy")} className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg h-10 px-6">
                        {t("nav.buyPolicy")}
                    </Button>
                    <Button onClick={() => navigate("/dashboard/claim-damage")} variant="outline" className="border-white/10 text-white hover:bg-white/5 h-10 px-6">
                        {t("nav.claimDamage")}
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => <div key={i} className="h-28 bg-white/[0.02] animate-pulse rounded-xl" />)
                ) : (
                    stats.map((stat, i) => {
                        const Icon = getIcon(stat.icon);
                        return (
                            <Card key={i} className="glass-card-hover rounded-xl group">
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.border} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`w-5 h-5 ${stat.color}`} />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">{stat.title}</p>
                                    <p className="text-[10px] text-slate-600 mt-0.5">{stat.sub}</p>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Mapped Land — Restructured instead of Quick Actions */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">{t("dash.mappedLand")}</h2>
                        <p className="text-xs text-slate-500">{t("dash.mappedLandSub")}</p>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="h-64 bg-white/[0.02] animate-pulse rounded-2xl" />
                        <div className="h-64 bg-white/[0.02] animate-pulse rounded-2xl" />
                    </div>
                ) : farms.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {farms.map((farm: any, idx) => (
                            <Card key={idx} className="glass-card-hover rounded-2xl overflow-hidden border border-white/[0.06]">
                                <CardContent className="p-0">
                                    <div className="p-5 flex items-center justify-between bg-white/[0.02] border-b border-white/[0.04]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                <Leaf className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">{farm.name || "Main Farm Area"}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-medium text-slate-400 capitalize bg-white/[0.05] px-2 py-0.5 rounded-full">{farm.crop_type}</span>
                                                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{farm.area?.toFixed(1)} Acres</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/crop-health")} className="h-8 text-xs text-slate-400 hover:text-white hover:bg-white/5">
                                            {t("dash.analyzeHealth")} <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </div>
                                    <div className="h-56 relative bg-[#0a0f1e]">
                                        {farm.boundary && farm.boundary.length > 0 ? (
                                            <LocationMap currentPosition={null} boundary={farm.boundary} isRecording={false} />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs italic">
                                                No boundary points available
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl flex flex-col items-center justify-center py-16 text-center border-dashed border-2 border-white/5">
                        <Satellite className="w-12 h-12 text-slate-700 mb-4" />
                        <h3 className="text-lg font-medium text-slate-300 mb-1">{t("dash.noMappedLand")}</h3>
                        <p className="text-sm text-slate-600 mb-6 max-w-xs">{t("dash.noMappedLandDesc")}</p>
                        <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                            {t("dash.mapFarmNow")}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
