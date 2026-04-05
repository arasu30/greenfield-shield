import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationMap } from "./LocationMap";
import { MapPin, Sprout, Loader2, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

interface AddFarmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CROP_OPTIONS = [
    { value: "Rice", label: "Rice" },
    { value: "Wheat", label: "Wheat" },
    { value: "Cotton", label: "Cotton" },
    { value: "Sugarcane", label: "Sugarcane" },
    { value: "Maize", label: "Maize" },
    { value: "Soybean", label: "Soybean" },
];

export const AddFarmModal = ({ isOpen, onClose, onSuccess }: AddFarmModalProps) => {
    const [farmName, setFarmName] = useState("");
    const [cropType, setCropType] = useState("");
    const [boundary, setBoundary] = useState<{ lat: number; lng: number }[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    
    // Walking Mode State
    const [mappingMode, setMappingMode] = useState<"click" | "walk">("click");
    const [isWalking, setIsWalking] = useState(false);
    const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
    const { t } = useLanguage();

    // Geolocation Tracking Logic
    React.useEffect(() => {
        let watchId: number | null = null;

        if (isWalking && navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude: lat, longitude: lng } = position.coords;
                    const newPos = { lat, lng };
                    setCurrentPosition(newPos);

                    // Only add to boundary if we moved a bit (prevents jitter)
                    setBoundary((prev) => {
                        if (prev.length === 0) return [newPos];
                        const lastPoint = prev[prev.length - 1];
                        const dist = Math.sqrt(Math.pow(lat - lastPoint.lat, 2) + Math.pow(lng - lastPoint.lng, 2));
                        // roughly 0.00002 is about 2 meters
                        if (dist > 0.00002) {
                            return [...prev, newPos];
                        }
                        return prev;
                    });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    toast.error("Failed to get GPS location. Please check permissions.");
                    setIsWalking(false);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }

        return () => {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        };
    }, [isWalking]);

    const handleMapClick = (lat: number, lng: number) => {
        if (mappingMode === "click") {
            setBoundary((prev) => [...prev, { lat, lng }]);
        }
    };

    const handleReset = () => {
        setBoundary([]);
    };

    const handleSave = async () => {
        if (!farmName) {
            toast.error("Please enter a name for your farm");
            return;
        }
        if (boundary.length < 3) {
            toast.error("Please map at least 3 points to define your farm area");
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem("access_token");
            const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

            const res = await fetch(`${baseUrl}/farmer/save-farm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    farm_name: farmName,
                    crop_type: cropType,
                    boundary_points: boundary,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "Failed to save farm");
            }

            toast.success(`Farm "${farmName}" registered successfully!`);
            onSuccess();
            onClose();
            // Reset state
            setFarmName("");
            setCropType("");
            setBoundary([]);
        } catch (err: any) {
            console.error("Error saving farm:", err);
            toast.error(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] bg-[#0d1326] border-white/[0.08] text-slate-100 p-0 overflow-hidden shadow-2xl">
                <div className="flex h-[500px]">
                    {/* Left Panel: Form */}
                    <div className="w-[280px] p-6 border-r border-white/[0.06] space-y-6 flex flex-col justify-between">
                        <div className="space-y-6">
                            <DialogHeader className="p-0">
                                <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                                    <Sprout className="w-5 h-5 text-emerald-400" /> {t("addFarm.title")}
                                </DialogTitle>
                                <DialogDescription className="text-slate-500 text-xs mt-1">
                                    {t("addFarm.desc")}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("addFarm.mappingMethod")}</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => { setMappingMode("click"); setIsWalking(false); }}
                                            className={cn(
                                                "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all text-[10px] font-bold uppercase",
                                                mappingMode === "click" 
                                                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10"
                                                    : "bg-white/[0.02] border-white/[0.06] text-slate-500 hover:border-white/10 hover:text-slate-300"
                                            )}
                                        >
                                            <MapPin className="w-4 h-4" /> {t("addFarm.manualClick")}
                                        </button>
                                        <button
                                            onClick={() => setMappingMode("walk")}
                                            className={cn(
                                                "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all text-[10px] font-bold uppercase",
                                                mappingMode === "walk" 
                                                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10"
                                                    : "bg-white/[0.02] border-white/[0.06] text-slate-500 hover:border-white/10 hover:text-slate-300"
                                            )}
                                        >
                                            <Sprout className="w-4 h-4" /> {t("addFarm.walkBoundary")}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("addFarm.farmName")}</Label>
                                    <Input
                                        placeholder={t("addFarm.farmNamePlace")}
                                        value={farmName}
                                        onChange={(e) => setFarmName(e.target.value)}
                                        className="bg-white/[0.03] border-white/[0.08] focus:border-emerald-500/50 h-10 text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("addFarm.primaryCrop")}</Label>
                                    <Select value={cropType} onValueChange={setCropType}>
                                        <SelectTrigger className="bg-white/[0.03] border-white/[0.08] h-10 text-sm">
                                            <SelectValue placeholder={t("addFarm.selectCrop")} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#151d35] border-white/[0.08] text-slate-200">
                                            {CROP_OPTIONS.map((c) => (
                                                <SelectItem key={c.value} value={c.value}>
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {mappingMode === "walk" && (
                                    <div className="space-y-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 animate-in fade-in zoom-in duration-300">
                                        <div className="flex items-center justify-between text-[10px] font-bold text-blue-400 uppercase tracking-tight">
                                            <span>{t("addFarm.gpsTracking")}</span>
                                            {isWalking && <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
                                        </div>
                                        <Button
                                            onClick={() => setIsWalking(!isWalking)}
                                            variant={isWalking ? "destructive" : "default"}
                                            className={cn(
                                                "w-full h-9 text-xs font-bold transition-all",
                                                !isWalking && "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20"
                                            )}
                                        >
                                            {isWalking ? t("addFarm.stopTracking") : t("addFarm.startWalking")}
                                        </Button>
                                        <p className="text-[9px] text-slate-500 leading-tight italic">
                                            {t("addFarm.gpsDesc")}
                                        </p>
                                    </div>
                                )}

                                {mappingMode === "click" && (
                                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-[11px] font-bold text-emerald-400 uppercase">{t("addFarm.instructions")}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                            {t("addFarm.instructionsDesc")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 pt-4">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-medium text-slate-500 uppercase">{t("addFarm.pointsMapped")}</span>
                                <span className={boundary.length >= 3 ? "text-emerald-400 font-bold text-xs" : "text-amber-400 font-bold text-xs"}>
                                    {boundary.length} / 3 min
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Map */}
                    <div className="flex-1 relative bg-slate-900/50">
                        <LocationMap
                            currentPosition={currentPosition}
                            boundary={boundary}
                            isRecording={isWalking}
                            onMapClick={handleMapClick}
                        />
                        {boundary.length > 0 && (
                            <button
                                onClick={handleReset}
                                className="absolute top-4 right-4 z-10 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-all backdrop-blur-md flex items-center gap-2 text-xs font-bold"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> {t("addFarm.clear")}
                            </button>
                        )}
                    </div>
                </div>
                <DialogFooter className="p-4 bg-[#0a0f1e]/80 border-t border-white/[0.06] backdrop-blur-md flex items-center justify-between gap-4">
                    <div className="flex-1 flex items-center gap-3">
                        {!farmName && (
                            <span className="text-[10px] text-amber-500/80 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20 animate-pulse">
                                ⚠️ Enter Farm Name
                            </span>
                        )}
                        {boundary.length < 3 && (
                            <span className="text-[10px] text-blue-400/80 bg-blue-400/10 px-2 py-1 rounded-md border border-blue-400/20 animate-pulse">
                                📍 Map 3+ points
                            </span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/5 h-10 px-6 text-sm font-medium">
                            {t("addFarm.cancel")}
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || boundary.length < 3 || !farmName}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-10 transition-all shadow-lg shadow-emerald-900/20 rounded-lg min-w-[140px]"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : t("addFarm.btnSave")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
