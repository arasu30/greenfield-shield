import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Calendar, MapPin } from "lucide-react";

const MyPolicies = () => {
  const navigate = useNavigate();

  const policies = [
    {
      id: "POL-2024-001",
      cropType: "Rice",
      season: "Kharif 2024",
      landArea: "5.0 acres",
      premium: "₹6,000",
      startDate: "15 Jun 2024",
      endDate: "15 Oct 2024",
      status: "Active",
      coverage: "₹3,00,000",
    },
    {
      id: "POL-2023-045",
      cropType: "Wheat",
      season: "Rabi 2023",
      landArea: "5.0 acres",
      premium: "₹5,000",
      startDate: "15 Nov 2023",
      endDate: "15 Mar 2024",
      status: "Expired",
      coverage: "₹2,50,000",
    },
    {
      id: "POL-2024-012",
      cropType: "Cotton",
      season: "Kharif 2024",
      landArea: "5.0 acres",
      premium: "₹7,500",
      startDate: "20 Jun 2024",
      endDate: "20 Oct 2024",
      status: "Active",
      coverage: "₹3,75,000",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Expired":
        return "bg-muted text-muted-foreground";
      case "Claimed":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">My Policies</h2>
          <p className="text-muted-foreground">View and manage your insurance policies</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{policy.cropType}</CardTitle>
                      <CardDescription className="mt-1">
                        Policy ID: {policy.id}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(policy.status)}>
                    {policy.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Season</p>
                      <p className="font-medium">{policy.season}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Land Area
                      </p>
                      <p className="font-medium">{policy.landArea}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Premium Paid</p>
                      <p className="font-medium text-primary">{policy.premium}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Coverage Amount</p>
                      <p className="font-medium text-success">{policy.coverage}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Policy Period
                      </p>
                      <p className="font-medium">{policy.startDate}</p>
                      <p className="text-sm text-muted-foreground">to {policy.endDate}</p>
                    </div>
                  </div>
                </div>

                {policy.status === "Active" && (
                  <div className="mt-6 pt-6 border-t flex gap-3">
                    <Button variant="outline" size="sm" onClick={() => navigate("/crop-health")}>
                      View Crop Health
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate("/claim-damage")}>
                      File Claim
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">Need more coverage?</p>
            <Button onClick={() => navigate("/buy-policy")}>
              Buy New Policy
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyPolicies;
