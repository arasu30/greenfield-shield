import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Language, t } from "@/lib/i18n";

interface OfficerLoginProps {
    role: "officer" | "admin";
    lang?: Language;
}

export const OfficerLogin = ({ role, lang = "en" }: OfficerLoginProps) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Please enter your credentials");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Login failed");
            }

            const data = await res.json();
            localStorage.setItem('access_token', data.tokens.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            toast.success("Login successful!");
            setTimeout(() => {
                if (data.user.role === 'admin') navigate('/admin');
                else if (data.user.role === 'officer') navigate('/officer-review');
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
            <div className="space-y-2">
                <Label className="text-slate-300 text-sm font-medium">{t(lang, "officer.email")}</Label>
                <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        type="email"
                        placeholder={t(lang, "officer.emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 ${inputClass}`}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-slate-300 text-sm font-medium">{t(lang, "officer.password")}</Label>
                <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 ${inputClass}`}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                </div>
            </div>

            <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-600/20"
            >
                {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t(lang, "officer.signingIn")}</>
                ) : t(lang, "officer.signIn")}
            </Button>
        </div>
    );
};
