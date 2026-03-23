import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Leaf, Lock, User, Users, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { toast } from "sonner";
import { AnimatedParticles } from "@/components/AnimatedParticles";
import { FarmerLogin } from "@/components/FarmerLogin";
import { FarmerRegister } from "@/components/FarmerRegister";
import { OfficerRegister } from "@/components/OfficerRegister";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<"farmer" | "officer" | "admin">("farmer");
  const [isFarmerRegistering, setIsFarmerRegistering] = useState(false);
  const [isOfficerRegistering, setIsOfficerRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [aboutOpen, setAboutOpen] = useState(false);
  
  // Loading & Success States
  const [isOfficerLoading, setIsOfficerLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const teamMembers = [
    {
      name: "Ilavarasu Thevar",
      // role: "Founder & CEO",
      // bio: "Agricultural tech innovator with 15+ years in crop insurance",
      avatar: "👤",
      linkedin: "https://www.linkedin.com/in/ilavarasu-thevar-8b239b307/",
      github: "https://github.com/arasu30"
    },
    {
      name: "Sudharsan Nadar",
      // role: "CTO & AI Lead",
      // bio: "Machine learning expert specializing in satellite imagery analysis",
      avatar: "👤",
      linkedin: "https://www.linkedin.com/in/sudharsan-nadar-645145313/",
      github: "https://github.com/sudhar25"
    },
    {
      name: "Tanish Srinivasan",
      // role: "Head of Operations",
      // bio: "Operations strategist focused on farmer empowerment",
      avatar: "👤",
      linkedin: "https://www.linkedin.com/in/tanish-srinivasan/",
      github: "https://github.com/TanishSrinivasan"
    },
    {
      name: "Steve Jason",
      // role: "Product Manager",
      // bio: "User experience designer with passion for agricultural solutions",
      avatar: "👤",
      linkedin: "https://www.linkedin.com/in/steve-jason-aab14b25a/",
      github: "https://github.com/56steve"
    },
  ];

  const handleOfficerLogin = async () => {
    if (!username.trim() || !password) {
      toast.error("Please enter valid credentials");
      return;
    }

    const email = username.includes("@") ? username : `${username}@gmail.com`;
    setIsOfficerLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'officer' }),
      });

      if (!res.ok) {
        const errText = await res.text();
        toast.error(`Login failed: ${errText}`);
        return;
      }

      const data = await res.json();
      localStorage.setItem('access_token', data.tokens.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success("Login successful!");
      setTimeout(() => {
          navigate('/officer-review');
      }, 1000);
      
    } catch (err) {
      toast.error('Network error during login');
    } finally {
      setIsOfficerLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!username.trim() || !password) {
      toast.error("Please enter valid credentials");
      return;
    }

    const email = username.includes("@") ? username : `${username}@gmail.com`;
    setIsAdminLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'admin' }),
      });

      if (!res.ok) {
        const errText = await res.text();
        toast.error(`Login failed: ${errText}`);
        return;
      }

      const data = await res.json();
      localStorage.setItem('access_token', data.tokens.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success("Login successful!");
      setTimeout(() => {
          navigate('/admin');
      }, 1000);
      
    } catch (err) {
      toast.error('Network error during login');
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden gap-10">
      <div className="flex flex-1 flex-col lg:flex-row relative">
        {/* Left Columns - Branding & Role Selection */}
        <div className="hidden lg:flex flex-col sticky top-0 h-screen w-1/2 p-12 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-0">
            <AnimatedParticles />
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* About Us & Logo */}
            <div className="space-y-8">
              <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/40 border border-slate-700/50 backdrop-blur-md hover:bg-slate-700/50 transition-all group">
                    <Users className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-slate-300 group-hover:text-cyan-200">About Us</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-cyan-100 flex items-center gap-2">
                      <Users className="w-6 h-6 text-cyan-400" />
                      Meet Our Team
                    </DialogTitle>
                    <DialogDescription className="text-slate-300 mt-2">
                      The brilliant minds behind CropSure, dedicated to revolutionizing crop insurance.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 hover:bg-cyan-500/20 transition-all duration-300 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{member.avatar}</div>
                          <div>
                            <h3 className="font-bold text-cyan-100 text-sm">{member.name}</h3>
                            {/* <p className="text-xs text-cyan-200/70">{member.role}</p> */}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-110 transition-transform"
                          >
                            <svg className="w-5 h-5 fill-cyan-400 hover:fill-white" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <div>
                <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
                  CropSure
                </h1>
                <p className="text-xl text-slate-400 max-w-md">
                  Empowering farmers with AI-driven protection. Secure your harvest, secure your future.
                </p>
              </div>
            </div>

            {/* Role Selection Group */}
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Select Account Type</p>
              <div className="space-y-3">
                <RoleButton
                  active={role === 'farmer'}
                  onClick={() => setRole('farmer')}
                  icon={<Leaf className="w-5 h-5" />}
                  title="Farmer"
                  desc="Access insurance policies & claims"
                />
                <RoleButton
                  active={role === 'officer'}
                  onClick={() => setRole('officer')}
                  icon={<Shield className="w-5 h-5" />}
                  title="Field Officer"
                  desc="Verify claims & inspect crops"
                />
                <RoleButton
                  active={role === 'admin'}
                  onClick={() => setRole('admin')}
                  icon={<Lock className="w-5 h-5" />}
                  title="Administrator"
                  desc="System management & oversight"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="w-full lg:w-1/2 bg-slate-950 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
          {/* Subtle Background Gradients for Right Panel */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-cyan-900/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-10 w-64 h-64 bg-green-900/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
          </div>

          <div className="w-full max-w-md space-y-8 relative z-10">

            {/* Mobile Header (visible only on small screens) */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-green-500 to-cyan-500 mb-4 shadow-lg shadow-green-500/20">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">CropSure</h2>

              {/* Mobile Role Switcher */}
              <div className="flex justify-center gap-2 mt-6">
                {(['farmer', 'officer', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize",
                      role === r
                        ? "bg-slate-800 text-white border border-slate-700 shadow-md"
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Content Based on Role */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

              {role === 'farmer' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {isFarmerRegistering ? "Join CropSure" : "Welcome Back"}
                    </h2>
                    <p className="text-slate-400">
                      {isFarmerRegistering ? "Create your account to start protecting your crops." : "Enter your details to access your dashboard."}
                    </p>
                  </div>

                  {/* Clean Toggle for Farmer */}
                  <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setIsFarmerRegistering(false)}
                      className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                        !isFarmerRegistering ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-200"
                      )}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setIsFarmerRegistering(true)}
                      className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                        isFarmerRegistering ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-200"
                      )}
                    >
                      Register
                    </button>
                  </div>

                  <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-800/60 rounded-xl p-6 shadow-2xl">
                    {isFarmerRegistering ? <FarmerRegister /> : <FarmerLogin />}
                  </div>
                </div>
              )}

              {role === 'officer' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {isOfficerRegistering ? "Officer Registration" : "Officer Portal"}
                    </h2>
                    <p className="text-slate-400">
                      {isOfficerRegistering ? "Join our field verification team." : "Secure access for field verification officers."}
                    </p>
                  </div>

                  {/* Toggle for Officer */}
                  <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setIsOfficerRegistering(false)}
                      className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                        !isOfficerRegistering ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-200"
                      )}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setIsOfficerRegistering(true)}
                      className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                        isOfficerRegistering ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-200"
                      )}
                    >
                      Register
                    </button>
                  </div>

                  {isOfficerRegistering ? (
                    <div className="backdrop-blur-xl bg-slate-900/60 border border-blue-500/20 rounded-xl p-6 shadow-2xl shadow-blue-900/10">
                      <OfficerRegister />
                    </div>
                  ) : (
                    <div className="backdrop-blur-xl bg-slate-900/60 border border-blue-500/20 rounded-xl p-6 shadow-2xl shadow-blue-900/10 space-y-5">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Email Address</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" />
                          <Input
                            placeholder="officer@cropsure.local"
                            className="pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-blue-500/50 h-11"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-blue-500/50 h-11"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleOfficerLogin}
                        disabled={isOfficerLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-11 font-medium shadow-lg hover:shadow-blue-500/50"
                      >
                        {isOfficerLoading ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating...</>
                        ) : "Access Portal"}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {role === 'admin' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Admin Control</h2>
                    <p className="text-slate-400">System configuration and management access.</p>
                  </div>

                  <div className="backdrop-blur-xl bg-slate-900/60 border border-purple-500/20 rounded-xl p-6 shadow-2xl shadow-purple-900/10 space-y-5">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Email Address</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-purple-400" />
                        <Input
                          placeholder="admin@cropsure.local"
                          className="pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-purple-500/50 h-11"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-purple-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-purple-500/50 h-11"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleAdminLogin}
                      disabled={isAdminLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-11 font-medium shadow-lg hover:shadow-purple-500/50"
                    >
                      {isAdminLoading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating...</>
                      ) : "Authenticate"}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Helper Component for Role Selection
const RoleButton = ({ active, onClick, icon, title, desc }: { active: boolean, onClick: () => void, icon: React.ReactNode, title: string, desc: string }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden",
      active
        ? "bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-900/20"
        : "bg-transparent border-slate-800 hover:bg-slate-800/50 hover:border-slate-700"
    )}
  >
    <div className="flex items-start gap-4 z-10 relative">
      <div className={cn(
        "p-3 rounded-lg transition-colors",
        active ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white"
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className={cn("font-semibold text-lg transition-colors", active ? "text-white" : "text-slate-300")}>
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-snug">{desc}</p>
      </div>
      {active && (
        <div className="absolute top-4 right-4 text-cyan-500 animate-in zoom-in spin-in-90 duration-300">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      )}
    </div>
  </button>
)

export default Login;
