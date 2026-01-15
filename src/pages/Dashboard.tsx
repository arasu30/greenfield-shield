import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AnimatedParticles } from "@/components/AnimatedParticles";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated background particles */}
      <AnimatedParticles />

      {/* Gradient overlay blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">Welcome back, Rajesh! 🌾</h1>
          <p className="text-xl text-slate-300 font-medium">Manage your crop insurance and monitor your farm health in real-time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {dashboardCards.map((card, index) => (
            <Card 
              key={index} 
              className="hover:shadow-2xl hover:shadow-green-400/30 transition-all duration-300 cursor-pointer group border border-green-500/20 backdrop-blur-sm bg-slate-900/50 hover:bg-slate-900/80 hover:border-green-400/50 transform hover:-translate-y-1"
              onClick={() => navigate(card.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-green-500/20`}>
                    <card.icon className={`w-7 h-7 text-green-400`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-green-400 group-hover:translate-x-2 transition-all duration-300" />
                </div>
                <CardTitle className="text-xl font-semibold text-green-100">{card.title}</CardTitle>
                <CardDescription className="text-slate-400 mt-2">{card.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-green-100 mb-6">🎯 Your Farm Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/80 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/40 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-400/40 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-blue-200">Active Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-blue-300 mb-2">3</p>
                <p className="text-sm text-blue-200/80 font-medium">Currently protecting 15 acres</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-400/40 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-400/40 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-amber-200">Pending Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-amber-300 mb-2">1</p>
                <p className="text-sm text-amber-200/80 font-medium">Under AI review</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-400/40 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-400/40 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-green-200">Crop Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-green-300 mb-2">85%</p>
                <p className="text-sm text-green-200/80 font-medium">Based on latest satellite data</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
