import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const FarmerLogin = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = () => {
        if (phone.length === 10) {
            setOtpSent(true);
            toast.success("OTP sent to your phone!");
        } else {
            toast.error("Please enter a valid 10-digit phone number");
        }
    };

    const handleFarmerLogin = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/auth/otp-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, otp })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Login failed");
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.tokens.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            toast.success("Login successful!");
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
            
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(error.message || "Error during login. Please ensure you are registered.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-5 mt-6">
            <div className="space-y-2">
                <Label htmlFor="phone-farmer" className="font-semibold text-cyan-200">
                    Phone Number
                </Label>
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
                <Button
                    onClick={handleSendOTP}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                >
                    Send OTP
                </Button>
            ) : (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="otp" className="font-semibold text-green-200">
                            Enter OTP
                        </Label>
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
                    <Button
                        onClick={handleFarmerLogin}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                    >
                        {isLoading ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin inline" /> Verifying...</>
                        ) : "Verify & Login"}
                    </Button>
                </>
            )}
        </div>
    );
};
