import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

const OfficerReview = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const statusParam = searchParams.get("status");

    const [claims, setClaims] = useState<any[]>([]);
    const [stats, setStats] = useState({ pending_count: 0, approved_count: 0, rejected_count: 0, total_count: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
            const statsRes = await fetch(`${backendUrl}/officer/stats`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (statsRes.ok) setStats(await statsRes.json());
            const claimsUrl = statusParam && statusParam !== 'all'
                ? `${backendUrl}/officer/claims?status=${statusParam === 'pending' ? 'Pending Review' : statusParam === 'approved' ? 'Approved' : 'Rejected'}`
                : `${backendUrl}/officer/claims`;
            const claimsRes = await fetch(claimsUrl, { headers: { 'Authorization': `Bearer ${token}` } });
            if (claimsRes.ok) setClaims(await claimsRes.json());
        } catch (error) { console.error("Error fetching officer data:", error); toast.error("Failed to load dashboard data"); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchDashboardData(); }, [statusParam]);

    const handleUpdateStatus = async (claimId: number, newStatus: string) => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/officer/claims/${claimId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error("Failed to update status");
            toast.success(`Claim ${newStatus.toLowerCase()} successfully!`);
            fetchDashboardData();
        } catch (error) { console.error("Update error:", error); toast.error("Error updating claim status"); }
    };

    const getStatusStyle = (status: string) => {
        if (status === "Approved") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
        if (status === "Rejected") return "bg-red-500/15 text-red-400 border-red-500/20";
        return "bg-amber-500/15 text-amber-400 border-amber-500/20";
    };

    const getDamageColor = (damage: number) => {
        if (damage >= 70) return "text-red-400";
        if (damage >= 40) return "text-amber-400";
        return "text-emerald-400";
    };

    const statCards = [
        { label: "Pending", value: stats.pending_count, icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10" },
        { label: "Approved", value: stats.approved_count, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { label: "Rejected", value: stats.rejected_count, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
        { label: "Total", value: stats.total_count, icon: AlertCircle, color: "text-blue-400", bg: "bg-blue-500/10" },
    ];

    return (
        <DashboardLayout role="officer">
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-up">
                {(!statusParam || statusParam === 'all') && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {statCards.map((s, i) => (
                            <Card key={i} className="glass-card-hover rounded-xl group">
                                <CardContent className="p-5 text-center">
                                    <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                        <s.icon className={`w-5 h-5 ${s.color}`} />
                                    </div>
                                    <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Card className="glass-card rounded-xl">
                    <CardHeader className="pb-4 border-b border-white/[0.06]">
                        <CardTitle className="text-lg font-semibold text-white">
                            {statusParam === 'pending' ? 'Pending Claims' : statusParam === 'approved' ? 'Approved Claims' : statusParam === 'rejected' ? 'Rejected Claims' : 'All Claims'}
                        </CardTitle>
                        <CardDescription className="text-slate-500 text-sm">
                            {statusParam === 'pending' ? 'Claims awaiting your review' : 'Comprehensive list of insurance claims'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-6 space-y-3">{Array(5).fill(0).map((_, i) => (<div key={i} className="h-14 bg-white/[0.02] animate-pulse rounded-lg" />))}</div>
                        ) : claims.length === 0 ? (
                            <div className="text-center py-16"><p className="text-slate-500">No claims found.</p></div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
                                        <TableHead className="text-slate-500 text-xs font-medium">Claim ID</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Farmer</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Crop</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Disaster</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">AI Damage</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Confidence</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Status</TableHead>
                                        <TableHead className="text-right text-slate-500 text-xs font-medium">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {claims.map((claim) => (
                                        <TableRow key={claim.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                            <TableCell className="font-medium text-blue-400 text-sm">#C-{claim.id}</TableCell>
                                            <TableCell>
                                                <p className="text-sm font-medium text-white">{claim.farmer_name || "Unknown"}</p>
                                                <p className="text-[10px] text-slate-600">ID: {claim.farmer_id}</p>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-300">{claim.crop_type}</TableCell>
                                            <TableCell><Badge variant="outline" className="bg-white/[0.04] border-white/[0.08] text-slate-300 text-xs">{claim.disaster_type}</Badge></TableCell>
                                            <TableCell><span className={`text-xl font-semibold ${getDamageColor(claim.ai_damage || 0)}`}>{(claim.ai_damage || 0).toFixed(0)}%</span></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-medium text-slate-300">{(claim.confidence || 0).toFixed(0)}%</span>
                                                    {(claim.confidence || 0) >= 90 && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline" className={`text-xs ${getStatusStyle(claim.status)}`}>{claim.status}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1.5 justify-end">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="hover:bg-white/[0.06] h-8 w-8 p-0"><Eye className="w-4 h-4 text-slate-400" /></Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl bg-[#0d1326] border-white/[0.08] text-slate-200">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-lg font-semibold text-white">Claim Details — #C-{claim.id}</DialogTitle>
                                                                <DialogDescription className="text-slate-500">Detailed view of claim and AI analysis</DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid grid-cols-2 gap-3 mt-4">
                                                                {[
                                                                    { l: "Farmer", v: claim.farmer_name || "Unknown" },
                                                                    { l: "Policy ID", v: claim.policy_id },
                                                                    { l: "Disaster", v: claim.disaster_type },
                                                                    { l: "Date", v: new Date(claim.created_at).toLocaleDateString() },
                                                                    { l: "Affected Area", v: claim.affected_area || "N/A" },
                                                                    { l: "AI Damage", v: `${(claim.ai_damage || 0).toFixed(0)}%` },
                                                                ].map((d, i) => (
                                                                    <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-3 rounded-lg">
                                                                        <p className="text-[10px] text-slate-600 font-medium mb-1">{d.l}</p>
                                                                        <p className="text-sm font-medium text-white">{d.v}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {claim.policy && (
                                                                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                                                                    <p className="text-xs text-slate-500 font-medium mb-3">Policy Information</p>
                                                                    <div className="grid grid-cols-3 gap-3">
                                                                        {[
                                                                            { l: "Premium", v: `₹${claim.policy.premium.toLocaleString()}` },
                                                                            { l: "Coverage", v: `₹${claim.policy.coverage.toLocaleString()}` },
                                                                            { l: "Season", v: claim.policy.season },
                                                                        ].map((d, i) => (
                                                                            <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-3 rounded-lg">
                                                                                <p className="text-[10px] text-slate-600 font-medium mb-1">{d.l}</p>
                                                                                <p className="text-sm font-medium text-white">{d.v}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </DialogContent>
                                                    </Dialog>
                                                    {claim.status === "Pending Review" && (
                                                        <>
                                                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(claim.id, "Approved")}
                                                                className="text-emerald-400 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 h-8 text-xs rounded-md">
                                                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                                                            </Button>
                                                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(claim.id, "Rejected")}
                                                                className="text-red-400 border-red-500/20 bg-red-500/10 hover:bg-red-500/20 h-8 text-xs rounded-md">
                                                                <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
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

export default OfficerReview;
