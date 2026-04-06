import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, Calendar, DollarSign, User, Filter, Eye } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const OfficerPolicies = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const statusParam = searchParams.get("status");

    const [policies, setPolicies] = useState<any[]>([]);
    const [stats, setStats] = useState({ active_policies_count: 0, pending_policies_count: 0, expired_policies_count: 0, total_count: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchPolicyData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
            const statsRes = await fetch(`${backendUrl}/officer/stats`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (statsRes.ok) setStats(await statsRes.json());
            const policiesUrl = statusParam && statusParam !== 'all'
                ? `${backendUrl}/officer/policies?status=${statusParam.charAt(0).toUpperCase() + statusParam.slice(1)}`
                : `${backendUrl}/officer/policies`;
            const policiesRes = await fetch(policiesUrl, { headers: { 'Authorization': `Bearer ${token}` } });
            if (policiesRes.ok) setPolicies(await policiesRes.json());
        } catch (error) { console.error("Error:", error); toast.error("Failed to load policy data"); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchPolicyData(); }, [statusParam]);

    const getStatusStyle = (status: string) => {
        if (status === "Active") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
        if (status === "Expired") return "bg-slate-500/15 text-slate-400 border-slate-500/20";
        return "bg-amber-500/15 text-amber-400 border-amber-500/20";
    };

    const statCards = [
        { label: "Active", value: stats.active_policies_count, icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", path: "/officer/policies?status=active" },
        { label: "Pending", value: stats.pending_policies_count, icon: Calendar, color: "text-amber-400", bg: "bg-amber-500/10", path: "/officer/policies?status=pending" },
        { label: "Expired", value: stats.expired_policies_count, icon: ShieldCheck, color: "text-slate-400", bg: "bg-slate-500/10", path: "/officer/policies?status=expired" },
    ];

    return (
        <DashboardLayout role="officer">
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-up">
                {(!statusParam || statusParam === 'all') && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {statCards.map((s, i) => (
                            <Card key={i} onClick={() => navigate(s.path)} className="glass-card-hover rounded-xl group cursor-pointer">
                                <CardContent className="p-5 text-center">
                                    <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                        <s.icon className={`w-5 h-5 ${s.color}`} />
                                    </div>
                                    <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">{s.label} Policies</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Card className="glass-card rounded-xl">
                    <CardHeader className="pb-4 border-b border-white/[0.06]">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-lg font-semibold text-white">
                                    {statusParam === 'active' ? 'Active' : statusParam === 'pending' ? 'Pending' : statusParam === 'expired' ? 'Expired' : 'All'} Policies
                                </CardTitle>
                                <CardDescription className="text-slate-500 text-sm">Manage farmer insurance policies</CardDescription>
                            </div>
                            <Button variant="outline" onClick={() => navigate('/officer/policies')}
                                className="border-white/[0.08] text-slate-400 hover:bg-white/[0.06] text-xs h-8">
                                <Filter className="w-3.5 h-3.5 mr-1.5" /> All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-6 space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="h-14 bg-white/[0.02] animate-pulse rounded-lg" />)}</div>
                        ) : policies.length === 0 ? (
                            <div className="text-center py-16"><p className="text-slate-500">No policies found.</p></div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
                                        <TableHead className="text-slate-500 text-xs font-medium">Policy ID</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Farmer ID</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Crop</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Season</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Coverage</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Status</TableHead>
                                        <TableHead className="text-right text-slate-500 text-xs font-medium">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {policies.map((policy) => (
                                        <TableRow key={policy.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                            <TableCell className="font-medium text-blue-400 text-sm">#P-{policy.id}</TableCell>
                                            <TableCell className="text-sm text-slate-400">Farmer #{policy.farmer_id}</TableCell>
                                            <TableCell className="text-sm text-slate-300">{policy.crop_type}</TableCell>
                                            <TableCell className="text-sm text-slate-400">{policy.season}</TableCell>
                                            <TableCell className="text-sm font-medium text-emerald-400">₹{policy.coverage.toLocaleString()}</TableCell>
                                            <TableCell><Badge variant="outline" className={`text-xs ${getStatusStyle(policy.status)}`}>{policy.status}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="hover:bg-white/[0.06] text-slate-400 text-xs">
                                                            <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-lg bg-[#0d1326] border-white/[0.08] text-slate-200">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-lg font-semibold text-white">Policy #P-{policy.id}</DialogTitle>
                                                            <DialogDescription className="text-slate-500">Insurance coverage details</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                                            {[
                                                                { icon: User, color: "text-blue-400", l: "Farmer ID", v: `#${policy.farmer_id}` },
                                                                { icon: ShieldCheck, color: "text-emerald-400", l: "Crop", v: policy.crop_type },
                                                                { icon: DollarSign, color: "text-amber-400", l: "Premium", v: `₹${policy.premium.toLocaleString()}` },
                                                                { icon: ShieldCheck, color: "text-emerald-400", l: "Coverage", v: `₹${policy.coverage.toLocaleString()}` },
                                                                { icon: Calendar, color: "text-blue-400", l: "Start", v: new Date(policy.start_date).toLocaleDateString() },
                                                                { icon: Calendar, color: "text-red-400", l: "End", v: new Date(policy.end_date).toLocaleDateString() },
                                                            ].map((d, i) => (
                                                                <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-3 rounded-lg flex items-center gap-2.5">
                                                                    <div className={`w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center ${d.color}`}><d.icon className="w-4 h-4" /></div>
                                                                    <div><p className="text-[10px] text-slate-600">{d.l}</p><p className="text-sm font-medium text-white">{d.v}</p></div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default OfficerPolicies;
