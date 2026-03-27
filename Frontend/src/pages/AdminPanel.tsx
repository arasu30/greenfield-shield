import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Users, DollarSign, Shield, LayoutDashboard, Save,
    Trash2, User, Loader2, CheckCircle, Plus, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const AdminPanel = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "overview";

    const [users, setUsers] = useState<any[]>([]);
    const [schemes, setSchemes] = useState<any[]>([]);
    const [rates, setRates] = useState<any[]>([]);
    const [claims, setClaims] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newScheme, setNewScheme] = useState({ name: "", description: "", eligibility_criteria: "", benefits: "", required_documents: "" });
    const [newRate, setNewRate] = useState({ crop_type: "", season: "", base_rate: "" });

    const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const getToken = () => localStorage.getItem("access_token");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = getToken();
            const headers = { Authorization: `Bearer ${token}` };
            const [usersRes, schemesRes, ratesRes, statsRes, claimsRes] = await Promise.all([
                fetch(`${baseUrl}/admin/users`, { headers }),
                fetch(`${baseUrl}/schemes/`, { headers }),
                fetch(`${baseUrl}/admin/rates`, { headers }),
                fetch(`${baseUrl}/officer/stats`, { headers }),
                fetch(`${baseUrl}/officer/claims?status=Approved`, { headers }),
            ]);
            if (usersRes.ok) setUsers(await usersRes.json());
            if (schemesRes.ok) setSchemes(await schemesRes.json());
            if (ratesRes.ok) setRates(await ratesRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
            if (claimsRes.ok) setClaims(await claimsRes.json());
            
            if (!usersRes.ok && !schemesRes.ok && !ratesRes.ok && !statsRes.ok) {
                toast.error("Failed to fetch admin data. Please check your connection.");
            }
        } catch (error) { console.error("Admin fetch error:", error); toast.error("Failed to load admin data"); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDeleteUser = async (userId: number) => {
        if (!confirm("Delete this user?")) return;
        try {
            const res = await fetch(`${baseUrl}/admin/users/${userId}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
            if (!res.ok) throw new Error("Delete failed");
            toast.success("User deleted");
            fetchData();
        } catch (error) { toast.error("Failed to delete user"); }
    };

    const handleCreateScheme = async () => {
        if (!newScheme.name || !newScheme.description) { toast.error("Name and description required"); return; }
        try {
            const res = await fetch(`${baseUrl}/admin/schemes`, {
                method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(newScheme)
            });
            if (!res.ok) throw new Error("Create failed");
            toast.success("Scheme created!");
            setNewScheme({ name: "", description: "", eligibility_criteria: "", benefits: "", required_documents: "" });
            fetchData();
        } catch (error) { toast.error("Failed to create scheme"); }
    };

    const handleSetRate = async () => {
        if (!newRate.crop_type || !newRate.season || !newRate.base_rate) { toast.error("Fill all rate fields"); return; }
        try {
            const res = await fetch(`${baseUrl}/admin/rates`, {
                method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ crop_type: newRate.crop_type, season: newRate.season, base_rate: parseFloat(newRate.base_rate) })
            });
            if (!res.ok) throw new Error("Set rate failed");
            toast.success("Insurance rate saved!");
            setNewRate({ crop_type: "", season: "", base_rate: "" });
            fetchData();
        } catch (error) { toast.error("Failed to save rate"); }
    };

    const handleDeleteRate = async (rateId: number) => {
        if (!confirm("Delete this insurance rate?")) return;
        try {
            const res = await fetch(`${baseUrl}/admin/rates/${rateId}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
            if (!res.ok) throw new Error("Delete failed");
            toast.success("Rate deleted");
            fetchData();
        } catch (error) { toast.error("Failed to delete rate"); }
    };

    const handleDeleteScheme = async (schemeId: number) => {
        if (!confirm("Deactivate this scheme?")) return;
        try {
            const res = await fetch(`${baseUrl}/schemes/${schemeId}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
            if (!res.ok) throw new Error("Deactivate failed");
            toast.success("Scheme deactivated");
            fetchData();
        } catch (error) { toast.error("Failed to deactivate scheme"); }
    };

    const handleSettleClaim = async (claimId: number) => {
        try {
            const res = await fetch(`${baseUrl}/admin/claims/${claimId}/settle`, { method: "PATCH", headers: { Authorization: `Bearer ${getToken()}` } });
            if (!res.ok) throw new Error("Settlement failed");
            toast.success("Claim marked as settled (paid)");
            fetchData();
        } catch (error) { toast.error("Failed to settle claim"); }
    };

    const statCards = [
        { label: "Total Users", value: users.length, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Active Policies", value: stats?.active_policies_count || 0, icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { label: "Pending Claims", value: stats?.pending_count || 0, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
        { label: "Govt Schemes", value: schemes.length, icon: DollarSign, color: "text-purple-400", bg: "bg-purple-500/10" },
    ];

    const inputClass = "h-10 bg-white/[0.03] border-white/[0.08] text-slate-100 placeholder-slate-600 focus:border-emerald-500/40 rounded-lg text-sm";

    return (
        <DashboardLayout role="admin">
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-up">
                <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })}>
                    <TabsList className="bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg">
                        {["overview", "users", "rates", "schemes", "compensation"].map((tab) => (
                            <TabsTrigger key={tab} value={tab}
                                className="text-xs font-medium capitalize data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 data-[state=active]:shadow-none text-slate-400 rounded-md px-4 py-1.5">
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Overview */}
                    <TabsContent value="overview" className="space-y-6 mt-6">
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
                    </TabsContent>

                    {/* Users */}
                    <TabsContent value="users" className="mt-6">
                        <Card className="glass-card rounded-xl">
                            <CardHeader className="pb-4 border-b border-white/[0.06]">
                                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-400" /> User Management
                                </CardTitle>
                                <CardDescription className="text-slate-500 text-sm">Manage all registered users</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="p-6 space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="h-14 bg-white/[0.02] animate-pulse rounded-lg" />)}</div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
                                                <TableHead className="text-slate-500 text-xs font-medium">Name</TableHead>
                                                <TableHead className="text-slate-500 text-xs font-medium">Email</TableHead>
                                                <TableHead className="text-slate-500 text-xs font-medium">Role</TableHead>
                                                <TableHead className="text-slate-500 text-xs font-medium">Joined</TableHead>
                                                <TableHead className="text-right text-slate-500 text-xs font-medium">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.map((u) => (
                                                <TableRow key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                    <TableCell className="font-medium text-white text-sm">{u.full_name}</TableCell>
                                                    <TableCell className="text-sm text-slate-400">{u.email}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`text-xs capitalize ${u.role === 'admin' ? 'bg-purple-500/15 text-purple-400 border-purple-500/20' : u.role === 'officer' ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'}`}>
                                                            {u.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-right">
                                                        {u.role !== 'admin' && (
                                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u.id)}
                                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Rates */}
                    <TabsContent value="rates" className="space-y-6 mt-6">
                        <Card className="glass-card rounded-xl">
                            <CardHeader className="pb-4 border-b border-white/[0.06]">
                                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-emerald-400" /> Set Rate
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-400 text-xs">Crop Type</Label>
                                        <Select value={newRate.crop_type} onValueChange={(v) => setNewRate({ ...newRate, crop_type: v })}>
                                            <SelectTrigger className={inputClass}><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent className="bg-[#151d35] border-white/[0.08] text-slate-200">
                                                {["Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Soybean"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-400 text-xs">Season</Label>
                                        <Select value={newRate.season} onValueChange={(v) => setNewRate({ ...newRate, season: v })}>
                                            <SelectTrigger className={inputClass}><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent className="bg-[#151d35] border-white/[0.08] text-slate-200">
                                                {["Kharif", "Rabi", "Zaid"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-400 text-xs">Base Rate (%)</Label>
                                        <Input type="number" step="0.01" placeholder="e.g. 2.5" value={newRate.base_rate}
                                            onChange={(e) => setNewRate({ ...newRate, base_rate: e.target.value })} className={inputClass} />
                                    </div>
                                    <Button onClick={handleSetRate} className="bg-emerald-600 hover:bg-emerald-500 text-white h-10 text-sm">
                                        <Save className="w-4 h-4 mr-1.5" /> Save Rate
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card rounded-xl">
                            <CardHeader className="pb-4 border-b border-white/[0.06]">
                                <CardTitle className="text-base font-semibold text-white">Current Rates</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {rates.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
                                                <TableHead className="text-slate-500 text-xs font-medium">Crop</TableHead>
                                                <TableHead className="text-slate-500 text-xs font-medium">Season</TableHead>
                                                <TableHead className="text-slate-500 text-xs font-medium">Base Rate</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rates.map((rate: any, i) => (
                                                <TableRow key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                    <TableCell className="text-sm text-white">{rate.crop_type}</TableCell>
                                                    <TableCell className="text-sm text-slate-400">{rate.season}</TableCell>
                                                    <TableCell className="text-sm font-medium text-emerald-400">{rate.base_rate}%</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRate(rate.id)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-12"><p className="text-slate-600 text-sm">No rates configured yet.</p></div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Schemes Management (Moved from old compensation tab) */}
                    <TabsContent value="schemes" className="space-y-6 mt-6">
                        <Card className="glass-card rounded-xl">
                            <CardHeader className="pb-4 border-b border-white/[0.06]">
                                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-emerald-400" /> Create Scheme
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-400 text-xs">Scheme Name</Label>
                                        <Input placeholder="PM-Fasal Bima Yojana" value={newScheme.name} onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })} className={inputClass} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-400 text-xs">Description</Label>
                                        <Input placeholder="Brief description" value={newScheme.description} onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })} className={inputClass} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-400 text-xs">Eligibility</Label>
                                        <Input placeholder="Eligibility criteria" value={newScheme.eligibility_criteria} onChange={(e) => setNewScheme({ ...newScheme, eligibility_criteria: e.target.value })} className={inputClass} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-400 text-xs">Benefits</Label>
                                        <Input placeholder="Key benefits" value={newScheme.benefits} onChange={(e) => setNewScheme({ ...newScheme, benefits: e.target.value })} className={inputClass} />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <Label className="text-slate-400 text-xs">Required Documents</Label>
                                        <Input placeholder="Aadhaar, land records, etc." value={newScheme.required_documents} onChange={(e) => setNewScheme({ ...newScheme, required_documents: e.target.value })} className={inputClass} />
                                    </div>
                                </div>
                                <Button onClick={handleCreateScheme} className="bg-emerald-600 hover:bg-emerald-500 text-white h-10 text-sm">
                                    <CheckCircle className="w-4 h-4 mr-1.5" /> Create Scheme
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="glass-card rounded-xl">
                            <CardHeader className="pb-4 border-b border-white/[0.06]">
                                <CardTitle className="text-base font-semibold text-white">Active Schemes ({schemes.length})</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {schemes.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
                                                <TableHead className="text-slate-500 text-xs font-medium">Name</TableHead>
                                                <TableHead className="text-slate-500 text-xs font-medium">Description</TableHead>
                                                <TableHead className="text-slate-500 text-xs font-medium">Status</TableHead>
                                                <TableHead className="text-right text-slate-500 text-xs font-medium">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {schemes.map((scheme: any) => (
                                                <TableRow key={scheme.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                    <TableCell className="text-sm font-medium text-white">{scheme.name}</TableCell>
                                                    <TableCell className="text-sm text-slate-400 max-w-xs truncate">{scheme.description}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/20">Active</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteScheme(scheme.id)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-12"><p className="text-slate-600 text-sm">No schemes created yet.</p></div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Functional Compensation Tab — Payout Management */}
                    <TabsContent value="compensation" className="space-y-6 mt-6">
                        <Card className="glass-card rounded-xl">
                            <CardHeader className="pb-4 border-b border-white/[0.06]">
                                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-emerald-400" /> Payout Management
                                </CardTitle>
                                <CardDescription className="text-slate-500 text-sm">Review and settle approved claims</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {claims.filter(c => !c.is_settled).length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
                                                <TableHead className="text-slate-500 text-xs font-medium">Farmer</TableHead>
                                                <TableHead className="text-slate-500 text-xs font-medium">Policy</TableHead>
                                                <TableHead className="text-slate-500 text-xs font-medium">Amount Due</TableHead>
                                                <TableHead className="text-slate-500 text-xs font-medium">Status</TableHead>
                                                <TableHead className="text-right text-slate-500 text-xs font-medium">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {claims.filter(c => !c.is_settled).map((claim: any) => (
                                                <TableRow key={claim.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                    <TableCell className="text-sm font-medium text-white">{claim.farmer_name}</TableCell>
                                                    <TableCell className="text-sm text-slate-400">#{claim.policy_id} - {claim.crop_type}</TableCell>
                                                    <TableCell className="text-sm font-medium text-white">₹{(claim.policy?.coverage * (claim.ai_damage / 100)).toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-[10px] bg-amber-500/15 text-amber-400 border-amber-500/20">Pending Payout</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button onClick={() => handleSettleClaim(claim.id)} size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white h-7 text-[10px] px-3">
                                                            Settle Payout
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-10 h-10 text-emerald-500/20 mx-auto mb-3" />
                                        <p className="text-slate-400 text-sm">All approved claims have been settled.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Settled History */}
                        <Card className="glass-card rounded-xl opacity-80">
                            <CardHeader className="pb-4 border-b border-white/[0.06]">
                                <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settled Payouts</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 text-slate-500">
                                <Table>
                                    <TableBody>
                                        {claims.filter(c => c.is_settled).map((claim: any) => (
                                            <TableRow key={claim.id} className="border-b border-white/[0.04] hover:bg-white/[0.01]">
                                                <TableCell className="py-2.5 text-xs">{claim.farmer_name}</TableCell>
                                                <TableCell className="py-2.5 text-xs">₹{(claim.policy?.coverage * (claim.ai_damage / 100)).toLocaleString()}</TableCell>
                                                <TableCell className="py-2.5 text-right"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default AdminPanel;
