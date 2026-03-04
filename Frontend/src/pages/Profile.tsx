import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { User, Smartphone, Mail, Shield, Calendar, Edit2, BadgeCheck, Building2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editData, setEditData] = useState<any>({});

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                setEditData({
                    full_name: data.full_name,
                    phone: data.phone || "",
                    address: data.address || "",
                    department: data.department || "",
                    officer_id: data.officer_id || ""
                });
            }
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setEditData({
                full_name: parsed.full_name,
                phone: parsed.phone || "",
                address: parsed.address || "",
                department: parsed.department || "",
                officer_id: parsed.officer_id || ""
            });
        }
        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/auth/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editData)
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } else {
                const err = await res.text();
                toast.error(`Update failed: ${err}`);
            }
        } catch (err) {
            toast.error("Network error during update");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    const profileFields = [
        { label: "Full Name", value: user.full_name, icon: User, color: "text-green-400" },
        { label: "Phone Number", value: user.phone || "Not provided", icon: Smartphone, color: "text-cyan-400" },
        { label: "Email Address", value: user.email, icon: Mail, color: "text-blue-400" },
        { label: "Account Role", value: user.role.toUpperCase(), icon: Shield, color: "text-purple-400" },
        { label: "Member Since", value: new Date(user.created_at).toLocaleDateString(), icon: Calendar, color: "text-amber-400" },
    ];

    if (user.role === 'officer') {
        profileFields.push(
            { label: "Department", value: user.department || "N/A", icon: Building2, color: "text-pink-400" },
            { label: "Officer ID", value: user.officer_id || "N/A", icon: BadgeCheck, color: "text-indigo-400" }
        );
    }

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
                        {!isEditing ? (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="bg-white text-slate-950 hover:bg-slate-200 font-semibold rounded-xl px-6 h-11"
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setIsEditing(false)}
                                    variant="outline"
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl px-4 h-11"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpdateProfile}
                                    disabled={isLoading}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-6 h-11 shadow-lg shadow-green-500/20"
                                >
                                    {isLoading ? "Saving..." : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!isEditing ? (
                    <>
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
                    </>
                ) : (
                    <Card className="md:col-span-2 bg-slate-900/50 backdrop-blur-md border-slate-800 overflow-hidden">
                        <CardHeader className="border-b border-slate-800/50 bg-slate-900/30">
                            <CardTitle className="text-lg font-semibold text-white">Edit Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-400">Full Name</Label>
                                    <Input
                                        value={editData.full_name}
                                        onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-white h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400">Phone Number</Label>
                                    <Input
                                        value={editData.phone}
                                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-white h-11"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-slate-400">Address</Label>
                                    <Input
                                        value={editData.address}
                                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-white h-11"
                                    />
                                </div>
                                {user.role === 'officer' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400">Department</Label>
                                            <Input
                                                value={editData.department}
                                                onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                                                className="bg-slate-800 border-slate-700 text-white h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400">Officer ID</Label>
                                            <Input
                                                value={editData.officer_id}
                                                onChange={(e) => setEditData({ ...editData, officer_id: e.target.value })}
                                                className="bg-slate-800 border-slate-700 text-white h-11"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Profile;
