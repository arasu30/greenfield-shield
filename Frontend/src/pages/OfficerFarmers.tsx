import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, User, Phone, Mail, MapPin, Sprout, Map as MapIcon, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { LocationMap } from "@/components/LocationMap";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const OfficerFarmers = () => {
    const [farmers, setFarmers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFarmers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
            const res = await fetch(`${backendUrl}/officer/farmers`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error("Failed to fetch farmers");
            setFarmers(await res.json());
        } catch (error) { console.error("Error:", error); toast.error("Failed to load farmers list"); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchFarmers(); }, []);

    return (
        <DashboardLayout role="officer">
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-up">
                <div>
                    <h1 className="page-title">Registered Farmers</h1>
                    <p className="page-subtitle">View and manage all farmers in the system</p>
                </div>

                <Card className="glass-card rounded-xl">
                    <CardHeader className="pb-4 border-b border-white/[0.06]">
                        <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                            <User className="w-4 h-4 text-emerald-400" /> Farmer Directory
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-6 space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="h-14 bg-white/[0.02] animate-pulse rounded-lg" />)}</div>
                        ) : farmers.length === 0 ? (
                            <div className="text-center py-16"><p className="text-slate-500">No farmers registered.</p></div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
                                        <TableHead className="text-slate-500 text-xs font-medium">Full Name</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Contact</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Member Since</TableHead>
                                        <TableHead className="text-slate-500 text-xs font-medium">Farms</TableHead>
                                        <TableHead className="text-right text-slate-500 text-xs font-medium">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {farmers.map((farmer) => (
                                        <TableRow key={farmer.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                            <TableCell className="font-medium text-white text-sm">{farmer.full_name}</TableCell>
                                            <TableCell>
                                                <div className="space-y-0.5">
                                                    <p className="text-xs text-slate-400 flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-600" /> {farmer.email}</p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-600" /> {farmer.phone || "N/A"}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500">{new Date(farmer.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell><Badge variant="outline" className="bg-white/[0.04] border-white/[0.08] text-slate-300 text-xs">{farmer.farms?.length || 0} Farm(s)</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="hover:bg-white/[0.06] text-slate-400 text-xs">
                                                            <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl bg-[#0d1326] border-white/[0.08] text-slate-200">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><User className="w-4 h-4 text-emerald-400" /></div>
                                                                {farmer.full_name}
                                                            </DialogTitle>
                                                            <DialogDescription className="text-slate-500">Farmer profile and agricultural assets</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                                                            <div className="space-y-4">
                                                                <div className="glass-card rounded-xl p-4 space-y-3">
                                                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">Contact Info</p>
                                                                    {[
                                                                        { icon: Mail, color: "text-blue-400", label: "Email", value: farmer.email },
                                                                        { icon: Phone, color: "text-emerald-400", label: "Phone", value: farmer.phone || "Not provided" },
                                                                        { icon: MapPin, color: "text-amber-400", label: "Address", value: farmer.address || "Not provided" },
                                                                    ].map((f, i) => (
                                                                        <div key={i} className="flex items-start gap-2.5">
                                                                            <f.icon className={`w-3.5 h-3.5 ${f.color} mt-0.5`} />
                                                                            <div><p className="text-[10px] text-slate-600">{f.label}</p><p className="text-sm text-slate-200">{f.value}</p></div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-medium mb-2">Policies ({farmer.policies?.length || 0})</p>
                                                                    {farmer.policies && farmer.policies.length > 0 ? farmer.policies.map((policy: any) => (
                                                                        <div key={policy.id} className="glass-card rounded-lg p-3 mb-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-white">{policy.crop_type} - {policy.season}</p>
                                                                                    <p className="text-[10px] text-slate-500 mt-0.5">Cov: ₹{policy.coverage.toLocaleString()} • Prem: ₹{policy.premium.toLocaleString()}</p>
                                                                                </div>
                                                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">{policy.status}</Badge>
                                                                            </div>
                                                                        </div>
                                                                    )) : <p className="text-xs text-slate-600 italic">No policies yet.</p>}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-medium mb-2">Farms ({farmer.farms?.length || 0})</p>
                                                                {farmer.farms && farmer.farms.length > 0 ? farmer.farms.map((farm: any) => (
                                                                    <div key={farm.id} className="glass-card rounded-lg overflow-hidden mb-3">
                                                                        <div className="p-3 flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Sprout className="w-4 h-4 text-emerald-400" /></div>
                                                                            <div>
                                                                                <p className="text-sm font-medium text-white">{farm.farm_name || `Farm #${farm.id}`}</p>
                                                                                <p className="text-[10px] text-slate-500">{farm.crop_type || "N/A"} • <span className="text-emerald-400 font-medium">{farm.area_acres?.toFixed(2) || "0.00"} ac</span></p>
                                                                            </div>
                                                                        </div>
                                                                        {farm.boundary && farm.boundary.length > 0 && <FarmMapToggle farm={farm} />}
                                                                    </div>
                                                                )) : <p className="text-xs text-slate-600 italic">No farms mapped.</p>}
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

const FarmMapToggle = ({ farm }: { farm: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="px-3 pb-3">
            <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-xs text-blue-400 hover:text-blue-300 h-7">
                    <MapIcon className="w-3 h-3 mr-1" /> {isOpen ? "Hide" : "Map"}
                    {isOpen ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </Button>
            </div>
            {isOpen && (
                <div className="mt-2 h-40 rounded-lg overflow-hidden border border-white/[0.06]">
                    <LocationMap currentPosition={null} boundary={farm.boundary} isRecording={false} />
                </div>
            )}
        </div>
    );
};

export default OfficerFarmers;
