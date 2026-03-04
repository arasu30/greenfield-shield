import { useState, useEffect } from "react"; // Added comment to trigger re-save
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, User, Phone, Mail, MapPin, Sprout, Map as MapIcon, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { LocationMap } from "@/components/LocationMap";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const OfficerFarmers = () => {
    const [farmers, setFarmers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFarmers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
            const res = await fetch(`${backendUrl}/officer/farmers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch farmers");
            const data = await res.json();
            setFarmers(data);
        } catch (error) {
            console.error("Error fetching farmers:", error);
            toast.error("Failed to load farmers list");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFarmers();
    }, []);

    return (
        <DashboardLayout role="officer">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Registered Farmers</h1>
                    <p className="text-slate-400">View and manage all farmers registered in the system</p>
                </div>

                <Card className="backdrop-blur-2xl bg-slate-900/80 border border-slate-800 shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-4 border-b border-slate-800/50">
                        <CardTitle className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <User className="w-5 h-5 text-green-400" />
                            Farmer Directory
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                {Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-16 bg-slate-800/50 animate-pulse rounded-lg"></div>
                                ))}
                            </div>
                        ) : farmers.length === 0 ? (
                            <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                                <p className="text-slate-400">No farmers registered in the system.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-slate-800 hover:bg-transparent">
                                        <TableHead className="text-slate-400">Full Name</TableHead>
                                        <TableHead className="text-slate-400">Contact</TableHead>
                                        <TableHead className="text-slate-400">Member Since</TableHead>
                                        <TableHead className="text-slate-400">Farms</TableHead>
                                        <TableHead className="text-right text-slate-400">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {farmers.map((farmer) => (
                                        <TableRow key={farmer.id} className="hover:bg-slate-800/50 border-b border-slate-800/50">
                                            <TableCell className="font-semibold text-slate-100">{farmer.full_name}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-slate-300 flex items-center gap-2">
                                                        <Mail className="w-3 h-3 text-slate-500" /> {farmer.email}
                                                    </p>
                                                    <p className="text-xs text-slate-400 flex items-center gap-2">
                                                        <Phone className="w-3 h-3 text-slate-500" /> {farmer.phone || "N/A"}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-sm">
                                                {new Date(farmer.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700">
                                                    {farmer.farms?.length || 0} Farm(s)
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="hover:bg-green-500/10 hover:text-green-400">
                                                            <Eye className="w-4 h-4 mr-2" /> View Details
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl bg-slate-950 border-slate-800 text-slate-100">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                                                <div className="p-2 rounded-xl bg-green-500/20 text-green-400">
                                                                    <User className="w-6 h-6" />
                                                                </div>
                                                                {farmer.full_name}
                                                            </DialogTitle>
                                                            <DialogDescription className="text-slate-400">Farmer profile and agricultural assets</DialogDescription>
                                                        </DialogHeader>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                                            <div className="space-y-6">
                                                                <Card className="bg-slate-900 border-slate-800">
                                                                    <CardHeader className="pb-3 px-4 pt-4">
                                                                        <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Contact Info</CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent className="px-4 pb-4 space-y-4">
                                                                        <div className="flex items-start gap-3">
                                                                            <Mail className="w-4 h-4 text-blue-400 mt-1" />
                                                                            <div>
                                                                                <p className="text-xs text-slate-500">Email Address</p>
                                                                                <p className="text-sm font-medium">{farmer.email}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-start gap-3">
                                                                            <Phone className="w-4 h-4 text-emerald-400 mt-1" />
                                                                            <div>
                                                                                <p className="text-xs text-slate-500">Phone</p>
                                                                                <p className="text-sm font-medium">{farmer.phone || "Not provided"}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-start gap-3">
                                                                            <MapPin className="w-4 h-4 text-amber-400 mt-1" />
                                                                            <div>
                                                                                <p className="text-xs text-slate-500">Primary Address</p>
                                                                                <p className="text-sm font-medium">{farmer.address || "Not provided"}</p>
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>

                                                                <div className="space-y-4">
                                                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">Insurance Policies ({farmer.policies?.length || 0})</h3>
                                                                    {farmer.policies && farmer.policies.length > 0 ? (
                                                                        <div className="space-y-3">
                                                                            {farmer.policies.map((policy: any) => (
                                                                                <Card key={policy.id} className="bg-slate-900 border-slate-800 p-3 hover:border-blue-500/30 transition-all duration-300">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="flex-1">
                                                                                            <p className="font-semibold text-sm text-slate-100">{policy.crop_type} - {policy.season}</p>
                                                                                            <div className="flex gap-3 mt-1">
                                                                                                <span className="text-[10px] text-slate-400 font-medium">Cov: ₹{policy.coverage.toLocaleString()}</span>
                                                                                                <span className="text-[10px] text-slate-400 font-medium">Prem: ₹{policy.premium.toLocaleString()}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <Badge variant="outline" className="text-[10px] bg-emerald-600/10 text-emerald-400 border-emerald-500/20 px-1.5 py-0">
                                                                                            {policy.status}
                                                                                        </Badge>
                                                                                    </div>
                                                                                </Card>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="p-4 rounded-xl bg-slate-900/50 border border-dashed border-slate-800 text-center">
                                                                            <p className="text-xs text-slate-500 italic">No policies purchased yet.</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">Farms ({farmer.farms?.length || 0})</h3>
                                                                {farmer.farms && farmer.farms.length > 0 ? (
                                                                    <div className="space-y-4">
                                                                        {farmer.farms.map((farm: any) => (
                                                                            <Card key={farm.id} className="bg-slate-900 border-slate-800 overflow-hidden hover:border-green-500/30 transition-all duration-300">
                                                                                <div className="p-4 flex items-center gap-4">
                                                                                    <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                                                                                        <Sprout className="w-5 h-5" />
                                                                                    </div>
                                                                                    <div className="flex-1">
                                                                                        <p className="font-semibold text-slate-100">{farm.farm_name || `Farm #${farm.id}`}</p>
                                                                                        <div className="flex items-center gap-3 mt-1">
                                                                                            <span className="text-xs text-slate-400">{farm.crop_type || "No crop specified"}</span>
                                                                                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                                                            <span className="text-xs font-bold text-green-500">{farm.area_acres?.toFixed(2) || "0.00"} Acres</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    {farm.boundary && farm.boundary.length > 0 && (
                                                                                        <FarmMapToggle farm={farm} />
                                                                                    )}
                                                                                </div>
                                                                            </Card>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-8 rounded-xl bg-slate-900/50 border border-dashed border-slate-800 text-center">
                                                                        <p className="text-sm text-slate-500 italic">No farms mapped for this farmer yet.</p>
                                                                    </div>
                                                                )}
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
        <div className="w-full">
            <div className="flex justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                    <MapIcon className="w-3.5 h-3.5 mr-1.5" />
                    {isOpen ? "Hide Map" : "View Map"}
                    {isOpen ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </Button>
            </div>
            {isOpen && (
                <div className="mt-3 h-48 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/50">
                    <LocationMap
                        currentPosition={null}
                        boundary={farm.boundary}
                        isRecording={false}
                    />
                </div>
            )}
        </div>
    );
};

export default OfficerFarmers;
