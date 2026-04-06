import React, { useState, useEffect } from "react";
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
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                setEditData({ full_name: data.full_name, phone: data.phone || "", address: data.address || "", department: data.department || "", officer_id: data.officer_id || "" });
            }
        } catch (err) { console.error("Failed to fetch profile:", err); }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setEditData({ full_name: parsed.full_name, phone: parsed.phone || "", address: parsed.address || "", department: parsed.department || "", officer_id: parsed.officer_id || "" });
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(editData)
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                toast.success("Profile updated!");
                setIsEditing(false);
            } else { const err = await res.text(); toast.error(`Update failed: ${err}`); }
        } catch (err) { toast.error("Network error during update"); }
        finally { setIsLoading(false); }
    };

    if (!user) return null;

    const profileFields = [
        { label: "Full Name", value: user.full_name, icon: User, color: "text-emerald-400" },
        { label: "Phone Number", value: user.phone || "Not provided", icon: Smartphone, color: "text-blue-400" },
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

    const inputClass = "h-11 bg-white/[0.03] border-white/[0.08] text-slate-100 focus:border-emerald-500/40 rounded-lg";

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
            {/* Header */}
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/[0.07] rounded-full blur-[80px]" />
                <div className="relative flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="w-24 h-24 border-2 border-white/[0.08]">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-emerald-600 text-2xl font-semibold text-white">
                            {user.full_name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center md:text-left space-y-1.5">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <h1 className="text-2xl font-semibold text-white">{user.full_name}</h1>
                            <BadgeCheck className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-sm text-slate-500 font-medium">Verified {user.role} member</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                            <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-400">
                                {user.id ? `ID: CS-${user.id.toString().padStart(4, '0')}` : 'ID: CS-NEW'}
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400">
                                Active
                            </span>
                        </div>
                    </div>

                    <div className="md:ml-auto">
                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)} variant="outline" className="border-white/[0.1] text-slate-300 hover:bg-white/[0.06] rounded-lg h-10">
                                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button onClick={() => setIsEditing(false)} variant="outline" className="border-white/[0.1] text-slate-400 hover:bg-white/[0.06] rounded-lg h-10">
                                    <X className="w-4 h-4 mr-2" /> Cancel
                                </Button>
                                <Button onClick={handleUpdateProfile} disabled={isLoading}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg h-10">
                                    {isLoading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save</>}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {!isEditing ? (
                    <>
                        <Card className="glass-card rounded-xl">
                            <CardHeader className="pb-3 border-b border-white/[0.06]">
                                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                                    <User className="w-4 h-4 text-emerald-400" /> Personal Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-1">
                                {profileFields.slice(0, 3).map((field, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                                        <div className={`w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center ${field.color}`}>
                                            <field.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">{field.label}</p>
                                            <p className="text-sm text-slate-200">{field.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card className="glass-card rounded-xl">
                            <CardHeader className="pb-3 border-b border-white/[0.06]">
                                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-purple-400" /> Account Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-1">
                                {profileFields.slice(3).map((field, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                                        <div className={`w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center ${field.color}`}>
                                            <field.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">{field.label}</p>
                                            <p className="text-sm text-slate-200">{field.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <Card className="md:col-span-2 glass-card rounded-xl">
                        <CardHeader className="pb-3 border-b border-white/[0.06]">
                            <CardTitle className="text-sm font-medium text-white">Edit Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-sm">Full Name</Label>
                                    <Input value={editData.full_name} onChange={(e) => setEditData({ ...editData, full_name: e.target.value })} className={inputClass} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-sm">Phone Number</Label>
                                    <Input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className={inputClass} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-slate-400 text-sm">Address</Label>
                                    <Input value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} className={inputClass} />
                                </div>
                                {user.role === 'officer' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 text-sm">Department</Label>
                                            <Input value={editData.department} onChange={(e) => setEditData({ ...editData, department: e.target.value })} className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 text-sm">Officer ID</Label>
                                            <Input value={editData.officer_id} onChange={(e) => setEditData({ ...editData, officer_id: e.target.value })} className={inputClass} />
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
