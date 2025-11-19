import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar userName="Officer Ramesh" userRole="officer" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Logout
        </Button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Claims Review Dashboard</h2>
          <p className="text-muted-foreground">Review and approve farmer claims based on AI analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-warning">{claims.filter(c => c.status === "Pending Review").length}</p>
                <p className="text-sm text-muted-foreground mt-1">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-success">{claims.filter(c => c.status === "Approved").length}</p>
                <p className="text-sm text-muted-foreground mt-1">Approved Today</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{claims.filter(c => c.status === "Rejected").length}</p>
                <p className="text-sm text-muted-foreground mt-1">Rejected</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{claims.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Claims</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Claims Queue</CardTitle>
            <CardDescription>Review AI-analyzed claims and make decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Crop Type</TableHead>
                  <TableHead>Disaster</TableHead>
                  <TableHead>AI Damage %</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{claim.farmerName}</p>
                        <p className="text-xs text-muted-foreground">{claim.farmerId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{claim.cropType}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{claim.disasterType}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-2xl font-bold ${getDamageColor(claim.aiDamage)}`}>
                        {claim.aiDamage}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{claim.confidence}%</span>
                        {claim.confidence >= 90 && (
                          <AlertCircle className="w-4 h-4 text-success" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-card">
                            <DialogHeader>
                              <DialogTitle>Claim Details - {claim.id}</DialogTitle>
                              <DialogDescription>Detailed view of the claim and AI analysis</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Farmer</p>
                                  <p className="font-medium">{claim.farmerName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Policy ID</p>
                                  <p className="font-medium">{claim.policyId}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Disaster Type</p>
                                  <p className="font-medium">{claim.disasterType}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Date</p>
                                  <p className="font-medium">{claim.date}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Affected Area</p>
                                  <p className="font-medium">{claim.affectedArea}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">AI Damage Assessment</p>
                                  <p className={`text-2xl font-bold ${getDamageColor(claim.aiDamage)}`}>
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
                              className="text-success border-success hover:bg-success/10"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReject(claim.id)}
                              className="text-destructive border-destructive hover:bg-destructive/10"
                            >
                              <XCircle className="w-4 h-4" />
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
    </div>
  );
};

export default OfficerReview;
