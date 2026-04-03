import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User, Mail, Lock, Phone,
    Play, Square, RefreshCw, Check,
    Sprout, Tractor, MousePointer2, Undo2, Map as MapIcon,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { LocationMap } from "./LocationMap";
import { Language, t } from "@/lib/i18n";

export const FarmerRegister = ({ lang = "en" as Language }: { lang?: Language }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        farm_name: "",
        crop_type: "Maize"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [boundaryPoints, setBoundaryPoints] = useState<Array<{ lat: number; lng: number }>>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [mappingMode, setMappingMode] = useState<'walk' | 'manual' | null>(null);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [mappingConfirmed, setMappingConfirmed] = useState(false);

    const handleMapClick = (lat: number, lng: number) => {
        if (mappingMode === 'manual' && !mappingConfirmed) {
            setBoundaryPoints((prev) => [...prev, { lat, lng }]);
        }
    };

    const undoLastPoint = () => { setBoundaryPoints((prev) => prev.slice(0, -1)); };

    const startMapping = () => {
        if (!navigator.geolocation) { toast.error("Geolocation is not supported by your browser"); return; }
        setBoundaryPoints([]);
        setMappingConfirmed(false);
        setIsRecording(true);
        setMappingMode('walk');
        toast.info("Starting to map. Walk around your farm boundary!");

        const id = navigator.geolocation.watchPosition(
            (position) => {
                const newPoint = { lat: position.coords.latitude, lng: position.coords.longitude };
                setCurrentPosition(newPoint);
                setBoundaryPoints((prev) => [...prev, newPoint]);
            },
            (error) => { console.error("Error watching position:", error); toast.error("Lost GPS signal. Please ensure you are outdoors."); },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
        setWatchId(id);
    };

    const stopMapping = () => {
        if (watchId !== null) { navigator.geolocation.clearWatch(watchId); setWatchId(null); }
        setIsRecording(false);
        const unique = boundaryPoints.filter((v, i, a) =>
            a.findIndex(t => t.lat.toFixed(5) === v.lat.toFixed(5) && t.lng.toFixed(5) === v.lng.toFixed(5)) === i
        );
        if (unique.length < 3) { toast.warning("You need at least 3 distinct corners."); setBoundaryPoints([]); }
        else { setBoundaryPoints(unique); toast.success("Farm boundary recorded!"); }
    };

    const resetMapping = () => {
        if (watchId !== null) { navigator.geolocation.clearWatch(watchId); setWatchId(null); }
        setIsRecording(false);
        setBoundaryPoints([]);
        setMappingConfirmed(false);
        setMappingMode(null);
        setCurrentPosition(null);
    };

    const handleRegister = async () => {
        if (!formData.full_name || !formData.email || !formData.password || !mappingConfirmed) {
            toast.error("Please fill all details and confirm your farm mapping");
            return;
        }
        if (formData.phone && formData.phone.length !== 10) { toast.error("Phone number must be exactly 10 digits"); return; }

        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email, full_name: formData.full_name, password: formData.password,
                    role: 'farmer', phone: formData.phone, farm_name: formData.farm_name,
                    crop_type: formData.crop_type, boundary: boundaryPoints
                }),
            });
            if (!res.ok) { const errData = await res.json(); throw new Error(errData.detail || "Registration failed"); }
            const data = await res.json();
            localStorage.setItem('access_token', data.tokens.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success("Registration successful!");
            setTimeout(() => { navigate('/dashboard'); }, 1000);
        } catch (err: any) { console.error(err); toast.error(err.message); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { return () => { if (watchId !== null) { navigator.geolocation.clearWatch(watchId); } }; }, [watchId]);

    const inputClass = "h-11 bg-white/[0.03] border-white/[0.08] text-slate-100 placeholder-slate-600 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 rounded-lg";

    return (
        <div className="space-y-5">
            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-slate-300 text-sm font-medium">{t(lang, "reg.fullName")}</Label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input name="full_name" placeholder="John Doe" value={formData.full_name} onChange={handleChange} className={`pl-10 ${inputClass}`} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300 text-sm font-medium">{t(lang, "officer.email")}</Label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} className={`pl-10 ${inputClass}`} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-slate-300 text-sm font-medium">{t(lang, "reg.phone")}</Label>
                    <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input name="phone" placeholder="10-digit mobile" maxLength={10} value={formData.phone} onChange={handleChange} className={`pl-10 ${inputClass}`} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300 text-sm font-medium">{t(lang, "reg.password")}</Label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className={`pl-10 ${inputClass}`} />
                    </div>
                </div>
            </div>

            {/* Farm Details */}
            <div className="glass-card rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <Tractor className="h-4 w-4" /> {t(lang, "reg.farmInfo")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-slate-400 text-sm">{t(lang, "reg.farmName")}</Label>
                        <Input name="farm_name" placeholder="Green Valley Plot A" value={formData.farm_name} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-400 text-sm">{t(lang, "reg.majorCrop")}</Label>
                        <select
                            name="crop_type" value={formData.crop_type} onChange={(e: any) => handleChange(e)}
                            className="w-full h-11 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 text-sm"
                        >
                            <option value="Maize">Maize</option>
                            <option value="Wheat">Wheat</option>
                            <option value="Rice">Rice</option>
                            <option value="Soybean">Soybean</option>
                            <option value="Sugarcane">Sugarcane</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-slate-300 text-sm font-medium">{t(lang, "reg.perimeterMapping")}</Label>

                    {!mappingMode && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Button onClick={startMapping} variant="outline" className="border-white/[0.08] bg-transparent text-emerald-400 hover:bg-emerald-500/10 h-16 gap-2 flex-col border-dashed">
                                <Play className="w-4 h-4 fill-current" />
                                <div className="text-center"><p className="font-medium text-xs">{t(lang, "reg.walkBoundary")}</p><p className="text-[10px] opacity-60">{t(lang, "reg.liveGps")}</p></div>
                            </Button>
                            <Button onClick={() => { setMappingMode('manual'); setBoundaryPoints([]); setMappingConfirmed(false); toast.info("Click on the map to mark farm corners"); }} variant="outline" className="border-white/[0.08] bg-transparent text-emerald-400 hover:bg-emerald-500/10 h-16 gap-2 flex-col border-dashed">
                                <MousePointer2 className="w-4 h-4" />
                                <div className="text-center"><p className="font-medium text-xs">{t(lang, "reg.pointOnMap")}</p><p className="text-[10px] opacity-60">{t(lang, "reg.manualSelection")}</p></div>
                            </Button>
                        </div>
                    )}

                    {mappingMode === 'manual' && !mappingConfirmed && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-white/[0.04] border border-white/[0.06] p-2 rounded-lg">
                                <span className="text-emerald-400 text-xs flex items-center gap-2"><MousePointer2 className="w-3.5 h-3.5" /> Manual Mode</span>
                                <div className="flex gap-2">
                                    <Button onClick={undoLastPoint} size="sm" variant="ghost" className="text-amber-400 h-7 text-xs" disabled={boundaryPoints.length === 0}><Undo2 className="w-3 h-3 mr-1" /> Undo</Button>
                                    <Button onClick={() => { if (boundaryPoints.length < 3) { toast.warning("Select at least 3 points"); return; } setMappingConfirmed(true); }} size="sm" className="bg-emerald-600 hover:bg-emerald-500 h-7 text-xs">Done</Button>
                                </div>
                            </div>
                            <LocationMap currentPosition={null} boundary={boundaryPoints} isRecording={false} onMapClick={handleMapClick} />
                            <p className="text-[10px] text-slate-600 text-center">Click on the map to add boundary corners. Minimum 3 points.</p>
                        </div>
                    )}

                    {isRecording && mappingMode === 'walk' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
                                <span className="text-amber-400 text-xs animate-pulse flex items-center gap-2"><div className="w-2 h-2 bg-amber-500 rounded-full" /> Recording...</span>
                                <Button onClick={stopMapping} size="sm" variant="destructive" className="h-7 text-xs">Finish Walk</Button>
                            </div>
                            <LocationMap currentPosition={currentPosition} boundary={boundaryPoints} isRecording={true} />
                        </div>
                    )}

                    {mappingMode && mappingConfirmed && (
                        <div className="space-y-3">
                            <LocationMap currentPosition={null} boundary={boundaryPoints} isRecording={false} />
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium"><Check className="w-4 h-4" /> Boundary Confirmed</div>
                                <div className="flex gap-4">
                                    <button onClick={() => setMappingConfirmed(false)} className="text-[10px] text-slate-400 underline hover:text-white transition-colors">Edit</button>
                                    <button onClick={resetMapping} className="text-[10px] text-amber-400 underline hover:text-amber-300 transition-colors">Switch Mode</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Button
                onClick={handleRegister} disabled={isLoading || !mappingConfirmed}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-600/20"
            >
                {isLoading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t(lang, "reg.creatingAccount")}</>) : t(lang, "reg.registerSaveFarm")}
            </Button>
        </div>
    );
};
