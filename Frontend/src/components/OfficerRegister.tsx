import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Language, t } from "@/lib/i18n";

export const OfficerRegister = ({ lang = "en" as Language }: { lang?: Language }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        phone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        if (!formData.full_name || !formData.email || !formData.password || !formData.phone) {
            toast.error("Please fill in all fields");
            return;
        }
        if (formData.password.length <= 5) { toast.error("Password must be at least 5 characters"); return; }

        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email, full_name: formData.full_name,
                    password: formData.password, role: 'officer', phone: formData.phone,
                }),
            });
            if (!res.ok) {
                const errText = await res.text();
                try { const errJson = JSON.parse(errText); throw new Error(errJson.detail || errText); }
                catch (e) { throw new Error(errText); }
            }
            const data = await res.json();
            localStorage.setItem('access_token', data.tokens.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success("Registration successful!");
            setTimeout(() => { navigate('/officer-review'); }, 1000);
        } catch (err: any) { console.error(err); toast.error(`Registration failed: ${err.message}`); }
        finally { setIsLoading(false); }
    };

    const inputClass = "pl-10 h-11 bg-white/[0.03] border-white/[0.08] text-slate-100 placeholder-slate-600 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 rounded-lg";

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Label className="text-slate-300 text-sm font-medium">{t(lang, "reg.fullName")}</Label>
                <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input name="full_name" placeholder="Officer Name" className={inputClass} value={formData.full_name} onChange={handleChange} />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-slate-300 text-sm font-medium">{t(lang, "officer.email")}</Label>
                <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input name="email" type="email" placeholder="officer@gov.in" className={inputClass} value={formData.email} onChange={handleChange} />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-slate-300 text-sm font-medium">{t(lang, "reg.phone")}</Label>
                <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input name="phone" type="tel" placeholder="10-digit mobile" maxLength={10} className={inputClass} value={formData.phone} onChange={handleChange} />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-slate-300 text-sm font-medium">{t(lang, "reg.password")}</Label>
                <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input name="password" type="password" placeholder="Create a strong password" className={inputClass} value={formData.password} onChange={handleChange} />
                </div>
            </div>

            <Button onClick={handleRegister} disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-600/20"
            >
                {isLoading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t(lang, "reg.registering")}</>) : t(lang, "reg.registerOfficer")}
            </Button>
        </div>
    );
};
