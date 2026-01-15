import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Shield, Smartphone } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setOtpSent(true);
      toast.success("OTP sent to your phone!");
    } else {
      toast.error("Please enter a valid 10-digit phone number");
    }
  };

  const handleLogin = (role: "farmer" | "officer" | "admin") => {
    if (otp.length === 6) {
      toast.success("Login successful!");
      if (role === "officer") {
        navigate("/officer-review");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      toast.error("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles/dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 left-20 w-1 h-1 bg-emerald-400 rounded-full animate-pulse opacity-60" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-20 right-32 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-60" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Decorative animated gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 dark:bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-500 dark:bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-green-500 shadow-2xl shadow-cyan-500/50 mb-6 transform hover:scale-110 hover:shadow-cyan-400/60 transition-all duration-300">
            <Leaf className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2">CropSure AI</h1>
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
                    <Button onClick={() => handleLogin("farmer")} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50">
                      Verify & Login
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="officer" className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="phone-officer" className="font-semibold text-blue-200">Phone Number</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" />
                    <Input
                      id="phone-officer"
                      placeholder="Enter phone number"
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 py-6 bg-slate-800/50 border border-blue-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    />
                  </div>
                </div>
                {!otpSent ? (
                  <Button onClick={handleSendOTP} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50">
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp-officer" className="font-semibold text-blue-200">Enter OTP</Label>
                      <Input
                        id="otp-officer"
                        placeholder="••••••"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center text-2xl font-bold tracking-widest py-6 bg-slate-800/50 border border-blue-500/30 text-slate-100 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      />
                    </div>
                    <Button onClick={() => handleLogin("officer")} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50">
                      Verify & Login
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="admin" className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="phone-admin" className="font-semibold text-purple-200">Phone Number</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3.5 h-5 w-5 text-purple-400" />
                    <Input
                      id="phone-admin"
                      placeholder="Enter admin phone"
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 py-6 bg-slate-800/50 border border-purple-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    />
                  </div>
                </div>
                {!otpSent ? (
                  <Button onClick={handleSendOTP} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50">
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp-admin" className="font-semibold text-purple-200">Enter OTP</Label>
                      <Input
                        id="otp-admin"
                        placeholder="••••••"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center text-2xl font-bold tracking-widest py-6 bg-slate-800/50 border border-purple-500/30 text-slate-100 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      />
                    </div>
                    <Button onClick={() => handleLogin("admin")} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50">
                      Verify & Login
                    </Button>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8 font-medium">
          🛡️ Bank-grade security | 🌾 AI-powered | 🛰️ Satellite-backed
        </p>
      </div>
    </div>
  );
};

export default Login;
