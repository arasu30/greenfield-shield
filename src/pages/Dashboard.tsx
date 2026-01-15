import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileText, AlertTriangle, Satellite, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: "Buy Insurance Policy",
      description: "Protect your crops with our AI-powered insurance",
      icon: ShieldCheck,
      color: "text-primary",
      bgColor: "bg-primary/10",
      path: "/buy-policy",
    },
    {
      title: "My Policies",
      description: "View and manage your active policies",
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
      path: "/my-policies",
    },
    {
      title: "Claim Crop Damage",
      description: "File a claim for crop damage or losses",
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
      path: "/claim-damage",
    },
    {
      title: "Satellite Crop Health",
      description: "View AI-analyzed satellite reports",
      icon: Satellite,
      color: "text-info",
      bgColor: "bg-info/10",
      path: "/crop-health",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100 dark:from-slate-950 dark:via-green-950 dark:to-slate-900">
      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-3">Welcome back, Rajesh! 🌾</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">Manage your crop insurance and monitor your farm health in real-time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {dashboardCards.map((card, index) => (
            <Card 
              key={index} 
              className="hover:shadow-2xl hover:shadow-green-200 dark:hover:shadow-green-900 transition-all duration-300 cursor-pointer group border border-slate-200 dark:border-slate-700 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-800 transform hover:-translate-y-1"
              onClick={() => navigate(card.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-xl ${card.bgColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <card.icon className={`w-7 h-7 ${card.color}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 group-hover:translate-x-2 transition-all duration-300" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">{card.title}</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 mt-2">{card.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Your Farm Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">Active Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">3</p>
                <p className="text-sm text-blue-700 dark:text-blue-200 font-medium">Currently protecting 15 acres</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-amber-900 dark:text-amber-100">Pending Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-amber-600 dark:text-amber-400 mb-2">1</p>
                <p className="text-sm text-amber-700 dark:text-amber-200 font-medium">Under review</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border-green-200 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-green-900 dark:text-emerald-100">Crop Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-green-600 dark:text-emerald-400 mb-2">85%</p>
                <p className="text-sm text-green-700 dark:text-emerald-200 font-medium">Based on latest satellite data</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
