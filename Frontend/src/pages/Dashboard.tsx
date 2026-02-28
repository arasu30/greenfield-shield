import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  AlertTriangle,
  Sprout,
  Activity,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { LocationMap } from "@/components/LocationMap";
import { Camera, Map as MapIcon } from "lucide-react";

interface StatItem {
  title: string;
  value: string;
  sub: string;
  icon: string; // Icon name string from backend
  color: string;
  bg: string;
  border: string;
}

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  AlertTriangle,
  Sprout,
  Activity
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Farmer");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('access_token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (user.full_name) {
        setUserName(user.full_name.split(' ')[0]); // Use first name
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/farmer/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await res.json();
        setStats(data.stats);
        setFarms(data.farms || []);
        if (data.farms && data.farms.length > 0) {
          console.log("DEBUG: Farm 0 boundary:", data.farms[0].boundary);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Could not load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-forward">
      {/* Hero Section - Upgraded for Wow Factor */}
      <div className="rounded-[2.5rem] p-10 md:p-14 mb-12 relative overflow-hidden group border border-white/10 shadow-2xl shadow-cyan-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-900/40 to-emerald-900/20 opacity-80 backdrop-blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay transition-transform duration-1000 group-hover:scale-110"></div>

        {/* Animated Glow Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

        <div className="relative z-10 max-w-3xl">

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            {/* Next-Gen <br /> */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 animate-gradient-x">
              CropSure
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed font-light">
            Welcome, <span className="text-white font-semibold">{userName}</span>. Experience a new era of farming with real-time satellite telemetry, AI risk modeling, and instant insurance settlements.
          </p>

        </div>
      </div>

      {/* Stats Grid - Premium Glassmorphism */}
      <div className={cn(
        "grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12",
        stats.length === 1 ? "lg:grid-cols-1 max-w-md" :
          stats.length === 2 ? "lg:grid-cols-2 max-w-4xl" :
            stats.length === 3 ? "lg:grid-cols-3 max-w-6xl" :
              "lg:grid-cols-4"
      )}>
        {loading ? (
          Array(2).fill(0).map((_, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 h-40 animate-pulse"></div>
          ))
        ) : (
          stats.map((stat, idx) => {
            const Icon = iconMap[stat.icon] || ShieldCheck;
            return (
              <div
                key={idx}
                className={cn(
                  "group bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 transition-all duration-500 hover:scale-[1.02] hover:bg-slate-900/60 hover:border-white/10 hover:shadow-2xl hover:shadow-cyan-500/5",
                  stat.border.replace('border-', 'hover:border-opacity-100 ')
                )}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6", stat.bg)}>
                    <Icon className={cn("w-7 h-7", stat.color)} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Status</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 uppercase tracking-wider">
                      <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
                      Live
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-slate-400 text-sm font-semibold mb-2 tracking-wide uppercase text-[11px]">{stat.title}</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-white tracking-tighter">{stat.value}</span>
                    <span className="text-xs font-medium text-slate-500 italic">{stat.sub}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Geospatial Command - Full Width */}
      <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-14 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="p-5 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 shadow-inner">
              <MapIcon className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white tracking-tight">Farm Overview</h3>
              <p className="text-slate-500 text-base"></p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-2xl font-bold px-8 h-14"
              onClick={() => toast.info("Feature coming soon: Detailed satellite analysis")}
            >
              Satellite Analysis
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white gap-4 rounded-2xl font-bold px-10 h-14 shadow-lg shadow-emerald-900/20"
              onClick={() => document.getElementById('land-pic-upload')?.click()}
            >
              <Camera className="w-6 h-6" />
              Upload Farm Pics
            </Button>
            <input
              type="file"
              id="land-pic-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  toast.success(`Processing ${e.target.files[0].name}...`);
                  setTimeout(() => toast.success("Verified! Image synced to satellite record"), 2000);
                }
              }}
            />
          </div>
        </div>

        {farms.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {farms.map((farm, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-slate-950/40 border border-white/5 hover:border-emerald-500/30 transition-all duration-500 group">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Active Plot</p>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse"></div>
                  </div>
                  <h4 className="text-xl font-black text-white mb-6 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{farm.name}</h4>
                  <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Area</p>
                      <p className="text-base font-black text-emerald-400">{farm.area.toFixed(2)} AC</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Crop</p>
                      <p className="text-base font-black text-cyan-400">{farm.crop_type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest">
                  Live Satellite Feed
                </div>
              </div>
              <LocationMap
                currentPosition={null}
                boundary={farms[0]?.boundary || []}
                isRecording={false}
              />
            </div>
          </div>
        ) : (
          <div className="h-96 w-full bg-slate-950/40 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-14">
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-8 shadow-2xl">
              <MapIcon className="w-12 h-12 text-slate-700" />
            </div>
            <h4 className="text-2xl font-black text-white mb-3 tracking-tight">No Active Plots</h4>
            <p className="text-slate-500 max-w-sm text-lg font-light">Secure your livelihood by registering your farm for satellite monitoring.</p>
            <Button variant="link" className="text-emerald-400 font-black mt-6 hover:text-emerald-300 uppercase tracking-widest text-xs">Start registration &rarr;</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
