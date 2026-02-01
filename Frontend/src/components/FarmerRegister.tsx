import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, User, MapPin, Check, X, Play, Square, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { LocationMap } from "./LocationMap";

export const FarmerRegister = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    // Boundary mapping state
    const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [boundaryPoints, setBoundaryPoints] = useState<Array<{ lat: number; lng: number }>>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [mappingConfirmed, setMappingConfirmed] = useState(false);

    // Ref to access current state inside callbacks if needed, though setState handle it ok

    const startMapping = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setBoundaryPoints([]); // Clear previous points
        setMappingConfirmed(false);
        setIsRecording(true);

        toast.info("Starting to map. Walk around your farm boundary!");

        const id = navigator.geolocation.watchPosition(
            (position) => {
                const newPoint = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setCurrentPosition(newPoint);

                // Add point to boundary path (breadcrumbs)
                // You might want to filter small jitters here in a real app (e.g. only add if moved > 5m)
                setBoundaryPoints((prev) => [...prev, newPoint]);
            },
            (error) => {
                console.error("Error watching position:", error);
                toast.error("Lost GPS signal. Please ensure you are outdoors.");
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        setWatchId(id);
    };

    const stopMapping = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        setIsRecording(false);

        if (boundaryPoints.length < 3) {
            toast.warning("Boundary seems too simple. Did you walk around?");
        } else {
            toast.success("Farm boundary recorded!");
        }
    };

    const resetMapping = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        setIsRecording(false);
        setBoundaryPoints([]);
        setMappingConfirmed(false);
        setCurrentPosition(null);
    };

    const handleRegister = () => {
        if (!name || phone.length !== 10 || !mappingConfirmed || boundaryPoints.length === 0) {
            toast.error("Please fill details and map your farm");
            return;
        }
        // Final check to close the loop
        if (boundaryPoints.length > 2) {
            // Ideally ensuring last point meets first point, but Polygon component handles visual closure
        }

        toast.success("Registration successful! Farm mapped.");
        console.log("Registered with boundary:", boundaryPoints);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);

    return (
        <div className="space-y-5 mt-6">
            <div className="space-y-2">
                <Label htmlFor="name-farmer" className="font-semibold text-cyan-200">
                    Full Name
                </Label>
                <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-cyan-400" />
                    <Input
                        id="name-farmer"
                        placeholder="Enter your full name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 py-6 bg-slate-800/50 border border-cyan-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone-farmer-reg" className="font-semibold text-cyan-200">
                    Phone Number
                </Label>
                <div className="relative">
                    <Smartphone className="absolute left-3 top-3.5 h-5 w-5 text-cyan-400" />
                    <Input
                        id="phone-farmer-reg"
                        placeholder="Enter 10-digit phone number"
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 py-6 bg-slate-800/50 border border-cyan-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="font-semibold text-cyan-200">Map Your Farm</Label>
                <p className="text-xs text-slate-400 mb-2">Walk around your farm boundary to map it.</p>

                {/* Initial State: Not Started & No Points */}
                {!isRecording && boundaryPoints.length === 0 && (
                    <Button
                        onClick={startMapping}
                        className="w-full bg-slate-800/50 border border-dashed border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-200 h-24 flex flex-col gap-2 transition-all duration-300"
                    >
                        <Play className="w-6 h-6" />
                        Start Mapping Boundary
                    </Button>
                )}

                {/* Recording State */}
                {isRecording && (
                    <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                        <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2 text-orange-200 animate-pulse">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                Recording Path... ({boundaryPoints.length} points)
                            </div>
                            <Button onClick={stopMapping} size="sm" variant="destructive" className="gap-2">
                                <Square className="w-4 h-4 fill-current" /> Stop
                            </Button>
                        </div>
                        <LocationMap currentPosition={currentPosition} boundary={boundaryPoints} isRecording={true} />
                    </div>
                )}

                {/* Finished State: Review */}
                {!isRecording && boundaryPoints.length > 0 && (
                    <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                        <LocationMap currentPosition={null} boundary={boundaryPoints} isRecording={false} />

                        {!mappingConfirmed ? (
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    onClick={() => setMappingConfirmed(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                >
                                    <Check className="w-4 h-4" /> Confirm Boundary
                                </Button>
                                <Button
                                    onClick={resetMapping}
                                    variant="outline"
                                    className="border-red-500/50 text-red-200 hover:bg-red-500/20 hover:text-red-100 gap-2 bg-transparent"
                                >
                                    <RefreshCw className="w-4 h-4" /> Remap
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg flex items-center gap-2 text-green-200 justify-center">
                                <Check className="w-5 h-5" /> Boundary Confirmed
                                <Button
                                    onClick={() => setMappingConfirmed(false)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-1 text-xs text-green-200/50 hover:text-green-200"
                                >
                                    (Edit)
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Button
                onClick={handleRegister}
                disabled={!mappingConfirmed}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Register Farmer
            </Button>
        </div>
    );
};
