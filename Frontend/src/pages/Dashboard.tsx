import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  AlertTriangle,
  Sprout,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";

const Dashboard = () => {
  const navigate = useNavigate();

  // Stats Data
  const stats = [
    {
      title: "Active Policies",
      value: "3",
      sub: "Protecting 15 acres",
      icon: ShieldCheck,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Pending Claims",
      value: "1",
      sub: "Under AI review",
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      title: "Crop Health",
      value: "85%",
      sub: "Stable condition",
      icon: Sprout,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      title: "AI Accuracy",
      value: "98.2%",
      sub: "Based on validation",
      icon: Activity,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    }
  ];

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <div className="rounded-3xl p-8 mb-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-slate-900/40 opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-098e98e51632?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"></div>
        <div className="absolute inset-0 border border-white/5 rounded-3xl"></div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            CropSure <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Dashboard</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-xl">
            Welcome back, Rajesh. Monitor your farm's performance, track insurance claims, and analyze crop health with real-time satellite insights.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button onClick={() => navigate('/buy-policy')} className="bg-white text-slate-900 hover:bg-slate-200 font-semibold px-6 h-12 rounded-xl">
              Get New Policy
            </Button>
            <Button onClick={() => navigate('/crop-health')} className="bg-white text-slate-900 hover:bg-slate-200 font-semibold px-6 h-12 rounded-xl">
              Check Crop Health
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className={cn("bg-slate-900/50 backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl", stat.border, `hover:shadow-${stat.color.split('-')[1]}-500/10`)}>
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <span className={cn("text-xs font-medium px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400")}>
                +2.5%
              </span>
            </div>
            <div>
              <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-xs text-slate-500">{stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Visuals Placeholder (Optional for now) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Crop Health Trend</h3>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">View Report</Button>
          </div>
          <div className="h-64 w-full bg-slate-950/50 rounded-xl border border-slate-800/50 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent"></div>
            {/* Placeholder for Chart */}
            <div className="flex items-end gap-2 h-40">
              {[40, 65, 50, 80, 75, 90, 85].map((h, i) => (
                <div key={i} className="w-8 bg-green-500/20 rounded-t-sm hover:bg-green-500/40 transition-colors" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <span className="absolute bottom-4 text-xs text-slate-500">Weekly NDVI Analysis</span>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Alerts</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4 items-start p-3 hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer">
                <div className="w-2 h-2 mt-2 rounded-full bg-amber-500"></div>
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Weather Warning</h4>
                  <p className="text-xs text-slate-500 mt-1">Heavy rain expected in your region. Check drainage systems.</p>
                  <span className="text-[10px] text-slate-600 mt-2 block">2 hours ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
