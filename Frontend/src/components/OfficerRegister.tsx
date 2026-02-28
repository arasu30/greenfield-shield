import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Phone, Building2, CreditCard, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const OfficerRegister = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        // department: "",
        // officer_id: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        // Basic Validation
        // if (!formData.full_name || !formData.email || !formData.password || !formData.phone || !formData.department || !formData.officer_id) {
        //     toast.error("Please fill in all fields");
        //     return;
        // }

        if (formData.password.length <= 5) {
            toast.error("Password must be at least 5 characters");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    full_name: formData.full_name,
                    password: formData.password,
                    role: 'officer',
                    phone: formData.phone,
                    // department: formData.department,
                    // officer_id: formData.officer_id,
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                // Try parsing JSON error if possible
                try {
                    const errJson = JSON.parse(errText);
                    throw new Error(errJson.detail || errText);
                } catch (e) {
                    throw new Error(errText);
                }
            }

            const data = await res.json();
            toast.success("Registration successful! Welcome Officer.");
            localStorage.setItem('access_token', data.tokens.access_token);
            navigate('/officer-review'); // Navigate to officer dashboard

        } catch (err: any) {
            console.error(err);
            toast.error(`Registration failed: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 mt-2">
            <div className="space-y-2">
                <Label className="text-slate-300">Full Name</Label>
                <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" />
                    <Input
                        name="full_name"
                        placeholder="Officer Name"
                        className="pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-blue-500/50 h-11"
                        value={formData.full_name}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-slate-300">Email Address</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" />
                    <Input
                        name="email"
                        type="email"
                        placeholder="officer@gov.in"
                        className="pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-blue-500/50 h-11"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-slate-300">Phone</Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" />
                    <Input
                        name="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className="pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-blue-500/50 h-11"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* <div className="grid grid-col"> */}
                {/* <div className="space-y-2">
                    <Label className="text-slate-300">Department</Label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" />
                        <Input
                            placeholder="Dept. of Agriculture"
                            className="pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-blue-500/50 h-11"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                        />
                    </div>
                </div> */}

                {/* <div className="space-y-2">
                    <Label className="text-slate-300">Officer ID</Label>
                    <div className="relative">
                        <BadgeCheck className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" />
                        <Input
                            placeholder="OFF-2024-001"
                            className="pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-blue-500/50 h-11"
                            name="officer_id"
                            value={formData.officer_id}
                            onChange={handleChange}
                        />
                    </div>
                </div> */}
            {/* </div> */}


            <div className="space-y-2 pb-2">
                <Label className="text-slate-300">Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h- w-5 text-blue-400" />
                    <Input
                        name="password"
                        type="password"
                        placeholder="Create a strong password"
                        className="pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-blue-500/50 h-11"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <Button
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-12 font-medium shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            >
                {isLoading ? "Registering..." : "Register as Officer"}
            </Button>
        </div>
    );
};
