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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


const OfficerReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status");

  const [claims, setClaims] = useState<any[]>([]);
  const [stats, setStats] = useState({
    pending_count: 0,
    approved_count: 0,
    rejected_count: 0,
    total_count: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

      // Fetch Stats
      const statsRes = await fetch(`${backendUrl}/officer/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) setStats(await statsRes.json());

      // Fetch Claims
      const claimsUrl = statusParam && statusParam !== 'all'
        ? `${backendUrl}/officer/claims?status=${statusParam === 'pending' ? 'Pending Review' : statusParam === 'approved' ? 'Approved' : 'Rejected'}`
        : `${backendUrl}/officer/claims`;

      const claimsRes = await fetch(claimsUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (claimsRes.ok) setClaims(await claimsRes.json());

    } catch (error) {
      console.error("Error fetching officer data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [statusParam]);

  const handleUpdateStatus = async (claimId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/officer/claims/${claimId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Claim ${newStatus.toLowerCase()} successfully!`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating claim status");
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Approved") return "bg-emerald-600 text-white";
    if (status === "Rejected") return "bg-red-600 text-white";
    return "bg-amber-600 text-white";
  };

  const getDamageColor = (damage: number) => {
    if (damage >= 70) return "text-destructive";
    if (damage >= 40) return "text-warning";
    return "text-success";
  };

  const filteredClaims = claims; // Already filtered by API or logic below

  const getPageTitle = () => {
    if (statusParam === 'pending') return 'Pending Reviews';
    if (statusParam === 'approved') return 'Approved Claims';
    if (statusParam === 'rejected') return 'Rejected Claims';
    return 'Claims Review Dashboard';
  };

  const getPageDescription = () => {
    if (statusParam === 'pending') return 'Claims awaiting your review and approval';
    if (statusParam === 'approved') return 'History of verified and approved claims';
    if (statusParam === 'rejected') return 'Claims that did not meet the criteria';
    return 'Review and approve farmer claims based on AI analysis';
  };

  return (
    <DashboardLayout role="officer">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {(!statusParam || statusParam === 'all') && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <Card className="backdrop-blur-2xl bg-amber-500/10 border border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 group transform hover:-translate-y-1">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <div className="inline-block p-3 rounded-lg bg-amber-500/20 border border-amber-500/30 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <AlertCircle className="w-6 h-6 text-amber-400" />
                  </div>
                  <p className="text-4xl font-bold text-amber-400">{stats.pending_count}</p>
                  <p className="text-sm text-amber-300/70 mt-2 font-medium">Pending Review</p>
                </div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 group transform hover:-translate-y-1">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <div className="inline-block p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-4xl font-bold text-emerald-400">{stats.approved_count}</p>
                  <p className="text-sm text-emerald-300/70 mt-2 font-medium">Approved</p>
                </div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-2xl bg-red-500/10 border border-red-500/30 shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 group transform hover:-translate-y-1">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <div className="inline-block p-3 rounded-lg bg-red-500/20 border border-red-500/30 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-4xl font-bold text-red-400">{stats.rejected_count}</p>
                  <p className="text-sm text-red-300/70 mt-2 font-medium">Rejected</p>
                </div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-2xl bg-blue-500/10 border border-blue-500/30 shadow-2xl shadow-blue-500/20 hover:shadow-blue-400/40 transition-all duration-300 group transform hover:-translate-y-1">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <div className="inline-block p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <AlertCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-4xl font-bold text-blue-400">{stats.total_count}</p>
                  <p className="text-sm text-blue-300/70 mt-2 font-medium">Total Claims</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="backdrop-blur-2xl bg-slate-900/80 border border-blue-500/30 shadow-2xl shadow-blue-500/20 hover:border-blue-400/50 hover:shadow-blue-400/30 transition-all duration-300 mb-10">
          <CardHeader className="pb-4 border-b border-blue-500/20">
            <CardTitle className="text-2xl font-bold text-blue-100">
              {statusParam === 'pending' ? '⏳ Pending Review Operations' :
                statusParam === 'approved' ? '✅ Approved Claims List' :
                  statusParam === 'rejected' ? '❌ Rejected Claims List' :
                    '📋 All Comp claims'}
            </CardTitle>
            <CardDescription className="text-slate-300 text-base">
              {statusParam === 'pending' ? 'Focus on these high-priority pending claims' :
                statusParam === 'approved' ? 'Processed and verified claims' :
                  statusParam === 'rejected' ? 'Claims denied due to policy violations' :
                    'Comprehensive list of all insurance claims'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-blue-500/5 animate-pulse rounded-lg border border-blue-500/10"></div>
                ))}
              </div>
            ) : filteredClaims.length === 0 ? (
              <div className="text-center py-20 bg-blue-500/5 rounded-2xl border border-dashed border-blue-500/20">
                <p className="text-slate-400 text-lg">No claims found matching this status.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/10">
                    <TableHead className="text-blue-300 font-bold">Claim ID</TableHead>
                    <TableHead className="text-blue-300 font-bold">Farmer</TableHead>
                    <TableHead className="text-blue-300 font-bold">Crop Type</TableHead>
                    <TableHead className="text-blue-300 font-bold">Disaster</TableHead>
                    <TableHead className="text-blue-300 font-bold">AI Damage %</TableHead>
                    <TableHead className="text-blue-300 font-bold">Confidence</TableHead>
                    <TableHead className="text-blue-300 font-bold">Status</TableHead>
                    <TableHead className="text-right text-blue-300 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.map((claim) => (
                    <TableRow key={claim.id} className="hover:bg-blue-500/10 border-b border-blue-500/10 transition-colors duration-200">
                      <TableCell className="font-bold text-blue-400">#C-{claim.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-100">{claim.farmer_name || "Unknown Farmer"}</p>
                          <p className="text-xs text-slate-400 font-medium">ID: {claim.farmer_id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-200">{claim.crop_type}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-300 font-medium">{claim.disaster_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-3xl font-bold ${getDamageColor(claim.ai_damage || 0)}`}>
                          {(claim.ai_damage || 0).toFixed(0)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-200">{(claim.confidence || 0).toFixed(0)}%</span>
                          {(claim.confidence || 0) >= 90 && (
                            <div className="p-1 rounded-full bg-emerald-500/20">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(claim.status)} font-bold px-3 py-1`}>
                          {claim.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-blue-500/20 rounded-lg transition-colors duration-200">
                                <Eye className="w-4 h-4 text-blue-400" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-slate-900 border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-blue-100">📄 Claim Details - #C-{claim.id}</DialogTitle>
                                <DialogDescription className="text-slate-300">Detailed view of the claim and AI analysis</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                                    <p className="text-xs text-blue-300/70 font-medium mb-1">Farmer</p>
                                    <p className="font-bold text-blue-100">{claim.farmer_name || "Unknown"}</p>
                                  </div>
                                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                                    <p className="text-xs text-blue-300/70 font-medium mb-1">Policy ID</p>
                                    <p className="font-bold text-blue-100">{claim.policy_id}</p>
                                  </div>
                                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                                    <p className="text-xs text-blue-300/70 font-medium mb-1">Disaster Type</p>
                                    <p className="font-bold text-blue-100">{claim.disaster_type}</p>
                                  </div>
                                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                                    <p className="text-xs text-blue-300/70 font-medium mb-1">Date Submitted</p>
                                    <p className="font-bold text-blue-100">{new Date(claim.created_at).toLocaleDateString()}</p>
                                  </div>
                                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                                    <p className="text-xs text-blue-300/70 font-medium mb-1">Affected Area</p>
                                    <p className="font-bold text-blue-100">{claim.affected_area || "N/A"}</p>
                                  </div>
                                  <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-lg">
                                    <p className="text-xs text-cyan-300/70 font-medium mb-1">AI Damage Assessment</p>
                                    <p className={`text-3xl font-bold ${getDamageColor(claim.ai_damage || 0)}`}>
                                      {(claim.ai_damage || 0).toFixed(0)}%
                                    </p>
                                  </div>
                                </div>

                                {claim.policy && (
                                  <div className="mt-6 border-t border-blue-500/20 pt-4">
                                    <h4 className="text-lg font-bold text-blue-100 mb-3 flex items-center">
                                      <Badge variant="outline" className="mr-2 bg-blue-500/20 border-blue-500/30 text-blue-300">Policy Information</Badge>
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                      <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                                        <p className="text-xs text-slate-400 font-medium mb-1">Premium</p>
                                        <p className="font-bold text-slate-100">₹{claim.policy.premium.toLocaleString()}</p>
                                      </div>
                                      <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                                        <p className="text-xs text-slate-400 font-medium mb-1">Coverage</p>
                                        <p className="font-bold text-slate-100">₹{claim.policy.coverage.toLocaleString()}</p>
                                      </div>
                                      <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                                        <p className="text-xs text-slate-400 font-medium mb-1">Season</p>
                                        <p className="font-bold text-slate-100">{claim.policy.season}</p>
                                      </div>
                                      <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                                        <p className="text-xs text-slate-400 font-medium mb-1">Status</p>
                                        <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">{claim.policy.status}</Badge>
                                      </div>
                                      <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                                        <p className="text-xs text-slate-400 font-medium mb-1">Start Date</p>
                                        <p className="font-bold text-slate-100">{new Date(claim.policy.start_date).toLocaleDateString()}</p>
                                      </div>
                                      <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                                        <p className="text-xs text-slate-400 font-medium mb-1">End Date</p>
                                        <p className="font-bold text-slate-100">{new Date(claim.policy.end_date).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          {claim.status === "Pending Review" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(claim.id, "Approved")}
                                className="text-emerald-400 border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg font-semibold transition-all duration-200"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(claim.id, "Rejected")}
                                className="text-red-400 border-red-500/50 bg-red-500/10 hover:bg-red-500/20 rounded-lg font-semibold transition-all duration-200"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
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
