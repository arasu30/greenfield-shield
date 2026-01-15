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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100 dark:from-slate-950 dark:via-green-950 dark:to-slate-900">
      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-8 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-10">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-3">My Policies</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">View and manage your insurance policies</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-2xl hover:shadow-green-200 dark:hover:shadow-green-900 transition-all duration-300 cursor-pointer group border border-slate-200 dark:border-slate-700 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-800 transform hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <FileText className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">{policy.cropType}</CardTitle>
                      <CardDescription className="mt-2 text-slate-600 dark:text-slate-300">
                        Policy ID: <span className="font-semibold text-slate-700 dark:text-slate-200">{policy.id}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${policy.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'} font-semibold px-4 py-2`}>
                    {policy.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Season</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{policy.season}</p>
                  </div>
                  <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Land Area</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{policy.landArea}</p>
                  </div>
                  <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Premium</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{policy.premium}</p>
                  </div>
                  <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wide">Coverage</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-200">{policy.coverage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPolicies;
