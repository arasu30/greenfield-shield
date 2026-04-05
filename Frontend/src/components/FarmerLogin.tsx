import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Phone, Loader2, ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Language, t } from "@/lib/i18n";

export const FarmerLogin = ({ lang = "en" as Language }: { lang?: Language }) => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = () => {
        if (!phone || phone.length !== 10) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }
        toast.success("OTP sent to +91 " + phone);
        toast.info("Dev mode: Enter any 6-digit code");
        setStep("otp");
    };

    const handleVerifyOTP = async (providedOtp?: string) => {
        const otpValue = providedOtp || otp;
        if (!otpValue || otpValue.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/auth/otp-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp: otpValue }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Login failed");
            }

            const data = await res.json();
            localStorage.setItem('access_token', data.tokens.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            toast.success("Login successful!");
            const role = data.user.role;
            setTimeout(() => {
                if (role === 'admin') navigate('/admin');
                else if (role === 'officer') navigate('/officer-review');
                else navigate('/dashboard');
            }, 500);

        } catch (err: any) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "h-11 bg-white/[0.03] border-white/[0.08] text-slate-100 placeholder-slate-600 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 rounded-lg";

    return (
        <div className="space-y-5">
            {step === "phone" ? (
                <>
                    <div className="space-y-2">
                        <Label className="text-slate-300 text-sm font-medium">{t(lang, "farmer.phoneNumber")}</Label>
                        <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">+91</div>
                            <Input
                                type="tel"
                                placeholder={t(lang, "farmer.phonePlaceholder")}
                                value={phone}
                                maxLength={10}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                className={`pl-[4.5rem] ${inputClass}`}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                            />
                        </div>
                        <p className="text-[11px] text-slate-600">{t(lang, "farmer.otpHint")}</p>
                    </div>

                    <Button
                        onClick={handleSendOTP}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-600/20"
                    >
                        {t(lang, "farmer.sendOtp")} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-400">
                            {t(lang, "farmer.otpSentTo")} <span className="text-emerald-400 font-medium">+91 {phone}</span>
                        </p>
                        <button onClick={() => { setStep("phone"); setOtp(""); }} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
                            <RotateCcw className="w-3 h-3" /> {t(lang, "farmer.change")}
                        </button>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-slate-300 text-sm font-medium">{t(lang, "farmer.enterOtp")}</Label>
                        <div className="flex justify-center py-2">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(val) => setOtp(val)}
                                onComplete={() => handleVerifyOTP()}
                            >
                                <InputOTPGroup className="gap-2.5">
                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <InputOTPSlot
                                            key={index}
                                            index={index}
                                            className="w-[46px] h-[58px] text-xl font-bold bg-white/[0.04] border-white/[0.1] text-emerald-400 rounded-xl transition-all duration-300 ring-offset-[#0a0f1e] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    </div>

                    <Button
                        onClick={() => handleVerifyOTP()}
                        disabled={isLoading || otp.length !== 6}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:shadow-none"
                    >
                        {isLoading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t(lang, "farmer.verifying")}</>
                        ) : t(lang, "farmer.verifySignin")}
                    </Button>

                    <button onClick={handleSendOTP} className="w-full text-center text-xs text-slate-500 hover:text-emerald-400 transition-colors">
                        {t(lang, "farmer.resendOtp")}
                    </button>
                </>
            )}
        </div>
    );
};
