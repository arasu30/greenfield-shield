import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, Calendar, DollarSign, User, Filter, Eye } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const OfficerPolicies = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const statusParam = searchParams.get("status");

    const [policies, setPolicies] = useState<any[]>([]);
    const [stats, setStats] = useState({
        active_policies_count: 0,
        pending_policies_count: 0,
        expired_policies_count: 0,
        total_count: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchPolicyData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

            // Fetch Stats
            const statsRes = await fetch(`${backendUrl}/officer/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            // Fetch Policies
            const policiesUrl = statusParam && statusParam !== 'all'
                ? `${backendUrl}/officer/policies?status=${statusParam.charAt(0).toUpperCase() + statusParam.slice(1)}`
                : `${backendUrl}/officer/policies`;

            const policiesRes = await fetch(policiesUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (policiesRes.ok) setPolicies(await policiesRes.json());

        } catch (error) {
            console.error("Error fetching policy data:", error);
            toast.error("Failed to load policy data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicyData();
    }, [statusParam]);

    const getStatusColor = (status: string) => {
        if (status === "Active") return "bg-emerald-600 text-white";
        if (status === "Expired") return "bg-slate-600 text-white";
        return "bg-amber-600 text-white";
    };

    const getPageTitle = () => {
        if (statusParam === 'active') return 'Active Policies';
        if (statusParam === 'pending') return 'Pending Policies';
        if (statusParam === 'expired') return 'Expired Policies';
        return 'Insurance Policy Management';
    };

    return (
        <DashboardLayout role="officer">
            <div className="container mx-auto px-4 py-8 max-w-7xl">

                {(!statusParam || statusParam === 'all') && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        <Card className="backdrop-blur-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 group transform hover:-translate-y-1">
                            <CardContent className="pt-6 pb-6" onClick={() => navigate('/officer/policies?status=active')}>
                                <div className="text-center cursor-pointer">
                                    <div className="inline-block p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <p className="text-4xl font-bold text-emerald-400">{stats.active_policies_count}</p>
                                    <p className="text-sm text-emerald-300/70 mt-2 font-medium">Active Policies</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="backdrop-blur-2xl bg-amber-500/10 border border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 group transform hover:-translate-y-1">
                            <CardContent className="pt-6 pb-6" onClick={() => navigate('/officer/policies?status=pending')}>
                                <div className="text-center cursor-pointer">
                                    <div className="inline-block p-3 rounded-lg bg-amber-500/20 border border-amber-500/30 mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <Calendar className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <p className="text-4xl font-bold text-amber-400">{stats.pending_policies_count}</p>
                                    <p className="text-sm text-amber-300/70 mt-2 font-medium">Pending Policies</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="backdrop-blur-2xl bg-slate-500/10 border border-slate-500/30 shadow-2xl shadow-slate-500/20 hover:shadow-slate-500/40 transition-all duration-300 group transform hover:-translate-y-1">
                            <CardContent className="pt-6 pb-6" onClick={() => navigate('/officer/policies?status=expired')}>
                                <div className="text-center cursor-pointer">
                                    <div className="inline-block p-3 rounded-lg bg-slate-500/20 border border-slate-500/30 mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <ShieldCheck className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-4xl font-bold text-slate-400">{stats.expired_policies_count}</p>
                                    <p className="text-sm text-slate-300/70 mt-2 font-medium">Expired Policies</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Card className="backdrop-blur-2xl bg-slate-900/80 border border-blue-500/30 shadow-2xl shadow-blue-500/20 transition-all duration-300 mb-10">
                    <CardHeader className="pb-4 border-b border-blue-500/20">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl font-bold text-blue-100">{getPageTitle()}</CardTitle>
                                <CardDescription className="text-slate-300 text-base">View and manage farmer insurance policies</CardDescription>
                            </div>
                            <Button variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20" onClick={() => navigate('/officer/policies')}>
                                <Filter className="w-4 h-4 mr-2" /> All Policies
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                {Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-16 bg-blue-500/5 animate-pulse rounded-lg border border-blue-500/10"></div>
                                ))}
                            </div>
                        ) : policies.length === 0 ? (
                            <div className="text-center py-20 bg-blue-500/5 rounded-2xl border border-dashed border-blue-500/20">
                                <p className="text-slate-400 text-lg">No policies found matching this status.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/10">
                                        <TableHead className="text-blue-300 font-bold">Policy ID</TableHead>
                                        <TableHead className="text-blue-300 font-bold">Farmer ID</TableHead>
                                        <TableHead className="text-blue-300 font-bold">Crop Type</TableHead>
                                        <TableHead className="text-blue-300 font-bold">Season</TableHead>
                                        <TableHead className="text-blue-300 font-bold">Coverage</TableHead>
                                        <TableHead className="text-blue-300 font-bold">Status</TableHead>
                                        <TableHead className="text-right text-blue-300 font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {policies.map((policy) => (
                                        <TableRow key={policy.id} className="hover:bg-blue-500/10 border-b border-blue-500/10 transition-colors duration-200">
                                            <TableCell className="font-bold text-blue-400">#P-{policy.id}</TableCell>
                                            <TableCell className="text-slate-300 font-medium">Farmer #{policy.farmer_id}</TableCell>
                                            <TableCell className="font-medium text-slate-200">{policy.crop_type}</TableCell>
                                            <TableCell className="text-slate-300">{policy.season}</TableCell>
                                            <TableCell className="text-emerald-400 font-bold">₹{policy.coverage.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusColor(policy.status)} font-bold px-3 py-1`}>
                                                    {policy.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="hover:bg-blue-500/20 rounded-lg transition-colors duration-200">
                                                            <Eye className="w-4 h-4 text-blue-400 mr-2" /> View Details
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl bg-slate-900 border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-xl font-bold text-blue-100">🛡️ Policy Details - #P-{policy.id}</DialogTitle>
                                                            <DialogDescription className="text-slate-300">Detailed insurance coverage and validity information</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                                            <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><User className="w-5 h-5" /></div>
                                                                <div>
                                                                    <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Farmer ID</p>
                                                                    <p className="font-bold text-slate-100">#{policy.farmer_id}</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><ShieldCheck className="w-5 h-5" /></div>
                                                                <div>
                                                                    <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Crop Type</p>
                                                                    <p className="font-bold text-slate-100">{policy.crop_type}</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400"><DollarSign className="w-5 h-5" /></div>
                                                                <div>
                                                                    <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Premium Amount</p>
                                                                    <p className="font-bold text-slate-100">₹{policy.premium.toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><ShieldCheck className="w-5 h-5" /></div>
                                                                <div>
                                                                    <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Coverage Limt</p>
                                                                    <p className="font-bold text-slate-100">₹{policy.coverage.toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-xl flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400"><Calendar className="w-5 h-5" /></div>
                                                                <div>
                                                                    <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Start Date</p>
                                                                    <p className="font-bold text-slate-100">{new Date(policy.start_date).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-red-500/20 text-red-400"><Calendar className="w-5 h-5" /></div>
                                                                <div>
                                                                    <p className="text-xs text-slate-500 font-medium whitespace-nowrap">End Date</p>
                                                                    <p className="font-bold text-slate-100">{new Date(policy.end_date).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
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
