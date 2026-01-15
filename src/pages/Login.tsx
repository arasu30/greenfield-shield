import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Leaf, Shield, Smartphone, Lock, User, X, Users } from "lucide-react";
import { toast } from "sonner";
import { AnimatedParticles } from "@/components/AnimatedParticles";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [aboutOpen, setAboutOpen] = useState(false);

  const teamMembers = [
    {
      name: "Ilavarasu Thevar",
      role: "Founder & CEO",
      bio: "Agricultural tech innovator with 15+ years in crop insurance",
      avatar: "👤",
      linkedin: "https://www.linkedin.com/in/ilavarasu-thevar-8b239b307/",
      github: "https://github.com/arasu30"
    },
    {
      name: "Sudharsan Nadar",
      role: "CTO & AI Lead",
      bio: "Machine learning expert specializing in satellite imagery analysis",
      avatar: "👤",
      linkedin: "https://www.linkedin.com/in/sudharsan-nadar-645145313/",
      github: "https://github.com/sudhar25"
    },
    {
      name: "Tanish Srinivasan",
      role: "Head of Operations",
      bio: "Operations strategist focused on farmer empowerment",
      avatar: "👤",
      linkedin: "https://www.linkedin.com/in/tanish-srinivasan/",
      github: "https://github.com/TanishSrinivasan"
    },
    {
      name: "Steve Jason",
      role: "Product Manager",
      bio: "User experience designer with passion for agricultural solutions",
      avatar: "👤",
      linkedin: "https://www.linkedin.com/in/steve-jason-aab14b25a/",
      github: "https://github.com/56steve"
    },
  ];

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setOtpSent(true);
      toast.success("OTP sent to your phone!");
    } else {
      toast.error("Please enter a valid 10-digit phone number");
    }
  };

  const handleFarmerLogin = () => {
    if (otp.length === 6) {
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Please enter a valid 6-digit OTP");
    }
  };

  const handleOfficerLogin = () => {
    if (username.trim() && password.length >= 6) {
      toast.success("Login successful!");
      navigate("/officer-review");
    } else {
      toast.error("Please enter valid credentials");
    }
  };

  const handleAdminLogin = () => {
    if (username.trim() && password.length >= 6) {
      toast.success("Login successful!");
      navigate("/admin");
    } else {
      toast.error("Please enter valid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* About Us Button */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="absolute top-6 left-6 text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 z-20 gap-2">
            <Users className="w-5 h-5" />
            <span className="hidden sm:inline">About Us</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-cyan-100 flex items-center gap-2">
              <Users className="w-6 h-6 text-cyan-400" />
              Meet Our Team
            </DialogTitle>
            <DialogDescription className="text-slate-300 mt-2">
              The brilliant minds behind CropSure, dedicated to revolutionizing crop insurance
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 hover:bg-cyan-500/20 transition-all duration-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{member.avatar}</div>
                  <h3 className="font-bold text-cyan-100 text-sm">{member.name}</h3>
                </div>
                <div className="flex gap-3">
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-6 h-6 text-cyan-400 hover:text-white transition-all duration-300 hover:scale-125"
                    title="LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                    </svg>
                  </a>
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-6 h-6 text-cyan-400 hover:text-white transition-all duration-300 hover:scale-125"
                    title="GitHub"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-lg">
            <p className="text-slate-300 text-sm leading-relaxed">
              <span className="text-cyan-300 font-semibold">CropSure</span> is on a mission to empower farmers with AI-driven crop insurance. Using cutting-edge satellite technology and machine learning, we protect agricultural livelihoods and ensure food security for generations to come.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Animated background particles */}
      <AnimatedParticles />
      
      {/* Decorative animated gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 dark:bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-500 dark:bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-green-500 shadow-2xl shadow-cyan-500/50 mb-6 transform hover:scale-110 hover:shadow-cyan-400/60 transition-all duration-300">
            <Leaf className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2">CropSure</h1>
          <p className="text-lg text-cyan-200 font-semibold">Smart Crop Insurance</p>
          <p className="text-sm text-slate-400 mt-2">🛰️ Satellite-Powered • 🤖 AI-Driven • 🌾 Farmer-First</p>
        </div>

        <Card className="backdrop-blur-2xl bg-slate-900/80 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 hover:border-cyan-400/50 hover:shadow-cyan-400/30 transition-all duration-300">
          <CardHeader className="pb-4 border-b border-cyan-500/20">
            <CardTitle className="text-2xl font-bold text-cyan-50">Secure Login</CardTitle>
            <CardDescription className="text-slate-300">Select your role and authenticate</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="farmer" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-1 rounded-lg mb-6 border border-slate-700/50">
                <TabsTrigger value="farmer" className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/50 transition-all duration-300">🌾 Farmer</TabsTrigger>
                <TabsTrigger value="officer" className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 transition-all duration-300">🛡️ Officer</TabsTrigger>
                <TabsTrigger value="admin" className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/50 transition-all duration-300">⚙️ Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="farmer" className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="phone-farmer" className="font-semibold text-cyan-200">Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3.5 h-5 w-5 text-cyan-400" />
                    <Input
                      id="phone-farmer"
                      placeholder="Enter 10-digit phone number"
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 py-6 bg-slate-800/50 border border-cyan-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <Button onClick={handleSendOTP} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50">
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="font-semibold text-green-200">Enter OTP</Label>
                      <Input
                        id="otp"
                        placeholder="••••••"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center text-2xl font-bold tracking-widest py-6 bg-slate-800/50 border border-green-500/30 text-slate-100 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                      />
                    </div>
                    <Button onClick={handleFarmerLogin} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50">
                      Verify & Login
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="officer" className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="username-officer" className="font-semibold text-blue-200">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" />
                    <Input
                      id="username-officer"
                      placeholder="Enter your username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 py-6 bg-slate-800/50 border border-blue-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-officer" className="font-semibold text-blue-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" />
                    <Input
                      id="password-officer"
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 py-6 bg-slate-800/50 border border-blue-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    />
                  </div>
                </div>

                <Button onClick={handleOfficerLogin} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50">
                  Login
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="username-admin" className="font-semibold text-purple-200">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-purple-400" />
                    <Input
                      id="username-admin"
                      placeholder="Enter your username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 py-6 bg-slate-800/50 border border-purple-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-admin" className="font-semibold text-purple-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-purple-400" />
                    <Input
                      id="password-admin"
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 py-6 bg-slate-800/50 border border-purple-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    />
                  </div>
                </div>

                <Button onClick={handleAdminLogin} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50">
                  Login
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8 font-medium">
          🛡️ Bank-grade security | 🌾 AI-powered | 🛰️ Satellite-backed
        </p> */}
      </div>
    </div>
  );
};

export default Login;
