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

  const [claims, setClaims] = useState([
    {
      id: "CLM-2024-089",
      farmerName: "Rajesh Kumar",
      farmerId: "FRM-1234",
      policyId: "POL-2024-001",
      cropType: "Rice",
      disasterType: "Flood",
      date: "12 Aug 2024",
      affectedArea: "3.5 acres",
      aiDamage: 68,
      status: "Pending Review",
      confidence: 92,
    },
    {
      id: "CLM-2024-087",
      farmerName: "Priya Sharma",
      farmerId: "FRM-5678",
      policyId: "POL-2024-045",
      cropType: "Cotton",
      disasterType: "Pest Attack",
      date: "10 Aug 2024",
      affectedArea: "2.0 acres",
      aiDamage: 45,
      status: "Pending Review",
      confidence: 88,
    },
    {
      id: "CLM-2024-085",
      farmerName: "Amit Patel",
      farmerId: "FRM-9012",
      policyId: "POL-2024-032",
      cropType: "Wheat",
      disasterType: "Drought",
      date: "08 Aug 2024",
      affectedArea: "4.5 acres",
      aiDamage: 82,
      status: "Approved",
      confidence: 95,
    },
  ]);

  const handleApprove = (claimId: string) => {
    setClaims(claims.map(claim =>
      claim.id === claimId ? { ...claim, status: "Approved" } : claim
    ));
    toast.success("Claim approved successfully!");
  };

  const handleReject = (claimId: string) => {
    setClaims(claims.map(claim =>
      claim.id === claimId ? { ...claim, status: "Rejected" } : claim
    ));
    toast.error("Claim rejected");
  };

  const getStatusColor = (status: string) => {
    if (status === "Approved") return "bg-success text-success-foreground";
    if (status === "Rejected") return "bg-destructive text-destructive-foreground";
    return "bg-warning text-warning-foreground";
  };

  const getDamageColor = (damage: number) => {
    if (damage >= 70) return "text-destructive";
    if (damage >= 40) return "text-warning";
    return "text-success";
  };

  const filteredClaims = claims.filter(claim => {
    if (!statusParam || statusParam === 'all') return true;
    if (statusParam === 'pending') return claim.status === 'Pending Review';
    if (statusParam === 'approved') return claim.status === 'Approved';
    if (statusParam === 'rejected') return claim.status === 'Rejected';
    return true;
  });

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
                  <p className="text-4xl font-bold text-amber-400">{claims.filter(c => c.status === "Pending Review").length}</p>
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
                  <p className="text-4xl font-bold text-emerald-400">{claims.filter(c => c.status === "Approved").length}</p>
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
                  <p className="text-4xl font-bold text-red-400">{claims.filter(c => c.status === "Rejected").length}</p>
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
                  <p className="text-4xl font-bold text-blue-400">{claims.length}</p>
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
            <Table>
              <TableHeader>
                <TableRow className="border-b border-blue-500/20 bg-blue-500/10">
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
                    <TableCell className="font-bold text-blue-400">{claim.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-slate-100">{claim.farmerName}</p>
                        <p className="text-xs text-slate-400 font-medium">{claim.farmerId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-200">{claim.cropType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-300 font-medium">{claim.disasterType}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-3xl font-bold ${getDamageColor(claim.aiDamage)}`}>
                        {claim.aiDamage}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-200">{claim.confidence}%</span>
                        {claim.confidence >= 90 && (
                          <div className="p-1 rounded-full bg-emerald-500/20">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={claim.status === "Approved" ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1" : claim.status === "Rejected" ? "bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1" : "bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1"}>
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
                              <DialogTitle className="text-xl font-bold text-blue-100">📄 Claim Details - {claim.id}</DialogTitle>
                              <DialogDescription className="text-slate-300">Detailed view of the claim and AI analysis</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                                  <p className="text-xs text-blue-300/70 font-medium mb-1">Farmer</p>
                                  <p className="font-bold text-blue-100">{claim.farmerName}</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                                  <p className="text-xs text-blue-300/70 font-medium mb-1">Policy ID</p>
                                  <p className="font-bold text-blue-100">{claim.policyId}</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                                  <p className="text-xs text-blue-300/70 font-medium mb-1">Disaster Type</p>
                                  <p className="font-bold text-blue-100">{claim.disasterType}</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                                  <p className="text-xs text-blue-300/70 font-medium mb-1">Date</p>
                                  <p className="font-bold text-blue-100">{claim.date}</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                                  <p className="text-xs text-blue-300/70 font-medium mb-1">Affected Area</p>
                                  <p className="font-bold text-blue-100">{claim.affectedArea}</p>
                                </div>
                                <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-lg">
                                  <p className="text-xs text-cyan-300/70 font-medium mb-1">AI Damage Assessment</p>
                                  <p className={`text-3xl font-bold ${getDamageColor(claim.aiDamage)}`}>
                                    {claim.aiDamage}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {claim.status === "Pending Review" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(claim.id)}
                              className="text-emerald-400 border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg font-semibold transition-all duration-200"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(claim.id)}
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
          </CardContent>
        </Card>
      </div>

    </DashboardLayout>
  );
};

export default OfficerReview;
