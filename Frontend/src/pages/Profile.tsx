import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { User, Smartphone, Mail, Shield, Calendar, Edit2, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) return null;

    const profileFields = [
        { label: "Full Name", value: user.full_name, icon: User, color: "text-green-400" },
        { label: "Phone Number", value: user.phone || "Not provided", icon: Smartphone, color: "text-cyan-400" },
        { label: "Email Address", value: user.email, icon: Mail, color: "text-blue-400" },
        { label: "Account Role", value: user.role.toUpperCase(), icon: Shield, color: "text-purple-400" },
        { label: "Member Since", value: new Date(user.created_at).toLocaleDateString(), icon: Calendar, color: "text-amber-400" },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-forward">
            {/* Header Card */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <Avatar className="w-32 h-32 border-4 border-slate-800 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-700 text-4xl font-bold text-white">
                                {user.full_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 p-2 bg-slate-800 border border-slate-700 rounded-full text-white hover:bg-green-600 transition-colors shadow-lg">
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <h1 className="text-3xl font-bold text-white">{user.full_name}</h1>
                            <BadgeCheck className="w-6 h-6 text-cyan-400 shrink-0" />
                        </div>
                        <p className="text-slate-400 font-medium">Verified {user.role} Member</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                            <div className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-300">
                                {user.id ? `ID: CS-${user.id.toString().padStart(4, '0')}` : 'ID: CS-NEW'}
                            </div>
                            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-400">
                                Status: Active
                            </div>
                        </div>
                    </div>

                    <div className="md:ml-auto">
                        <Button className="bg-white text-slate-950 hover:bg-slate-200 font-semibold rounded-xl px-6 h-11">
                            Edit Profile
                        </Button>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 backdrop-blur-md border-slate-800 overflow-hidden group">
                    <CardHeader className="border-b border-slate-800/50 bg-slate-900/30">
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-green-400" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {profileFields.slice(0, 3).map((field, i) => (
                            <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                                <div className={`p-2 rounded-lg bg-slate-800 ${field.color}`}>
                                    <field.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{field.label}</p>
                                    <p className="text-slate-100 font-medium">{field.value}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 backdrop-blur-md border-slate-800 overflow-hidden">
                    <CardHeader className="border-b border-slate-800/50 bg-slate-900/30">
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-purple-400" />
                            Account Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {profileFields.slice(3).map((field, i) => (
                            <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                                <div className={`p-2 rounded-lg bg-slate-800 ${field.color}`}>
                                    <field.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{field.label}</p>
                                    <p className="text-slate-100 font-medium">{field.value}</p>
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                            <p className="text-xs text-slate-300 leading-relaxed italic">
                                "Your profile information is used to personalize your experience and ensure accurate insurance claim processing."
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
