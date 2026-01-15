import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AnimatedParticles } from "@/components/AnimatedParticles";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-900 to-slate-950 relative overflow-hidden">
      {/* Animated background particles */}
      <AnimatedParticles />

      {/* Gradient blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse" style={{animationDelay: '2s'}}></div>

      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-8 text-slate-300 hover:text-emerald-400 transition-all duration-300">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-10">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent mb-3">My Policies</h2>
          <p className="text-lg text-slate-300 font-medium">View and manage your insurance policies</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {policies.map((policy) => (
            <Card key={policy.id} className="backdrop-blur-2xl bg-slate-900/80 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 hover:border-emerald-400/50 hover:shadow-emerald-400/30 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1">
              <CardHeader className="pb-4 border-b border-emerald-500/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-emerald-500/20">
                      <FileText className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-emerald-100">{policy.cropType}</CardTitle>
                      <CardDescription className="mt-2 text-slate-300">
                        Policy ID: <span className="font-semibold text-emerald-300">{policy.id}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${policy.status === 'Active' ? 'bg-emerald-600 text-emerald-50' : 'bg-slate-700 text-slate-200'} font-semibold px-4 py-2`}>
                    {policy.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">Season</p>
                    <p className="text-lg font-bold text-emerald-100">{policy.season}</p>
                  </div>
                  <div className="space-y-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">Land Area</p>
                    <p className="text-lg font-bold text-emerald-100">{policy.landArea}</p>
                  </div>
                  <div className="space-y-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">Premium</p>
                    <p className="text-lg font-bold text-emerald-300">{policy.premium}</p>
                  </div>
                  <div className="space-y-2 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Coverage</p>
                    <p className="text-lg font-bold text-cyan-300">{policy.coverage}</p>
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
