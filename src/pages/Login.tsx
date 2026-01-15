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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950 dark:via-slate-950 dark:to-emerald-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative animated elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 dark:bg-green-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 dark:bg-emerald-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
            <Leaf className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-3">CropSure AI</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">Smart Crop Insurance Platform</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Protected by AI & Satellite Technology</p>
        </div>

        <Card className="backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">Select your role and sign in</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="farmer" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6">
                <TabsTrigger value="farmer" className="rounded-md">Farmer</TabsTrigger>
                <TabsTrigger value="officer" className="rounded-md">Officer</TabsTrigger>
                <TabsTrigger value="admin" className="rounded-md">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="farmer" className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="phone-farmer" className="font-semibold text-slate-700 dark:text-slate-200">Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                      id="phone-farmer"
                      placeholder="Enter 10-digit phone number"
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 py-6 text-base border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <Button onClick={handleSendOTP} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="font-semibold text-slate-700 dark:text-slate-200">Enter OTP</Label>
                      <Input
                        id="otp"
                        placeholder="••••••"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center text-2xl font-bold tracking-widest py-6 border-slate-200 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                    <Button onClick={() => handleLogin("farmer")} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                      Verify & Login
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="officer" className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="phone-officer" className="font-semibold text-slate-700 dark:text-slate-200">Phone Number</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                      id="phone-officer"
                      placeholder="Enter phone number"
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 py-6 text-base border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>
                {!otpSent ? (
                  <Button onClick={handleSendOTP} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp-officer" className="font-semibold text-slate-700 dark:text-slate-200">Enter OTP</Label>
                      <Input
                        id="otp-officer"
                        placeholder="••••••"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center text-2xl font-bold tracking-widest py-6 border-slate-200 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                    <Button onClick={() => handleLogin("officer")} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                      Verify & Login
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="admin" className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="phone-admin" className="font-semibold text-slate-700 dark:text-slate-200">Phone Number</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                      id="phone-admin"
                      placeholder="Enter admin phone"
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 py-6 text-base border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>
                {!otpSent ? (
                  <Button onClick={handleSendOTP} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp-admin" className="font-semibold text-slate-700 dark:text-slate-200">Enter OTP</Label>
                      <Input
                        id="otp-admin"
                        placeholder="••••••"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center text-2xl font-bold tracking-widest py-6 border-slate-200 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                    <Button onClick={() => handleLogin("admin")} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
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
