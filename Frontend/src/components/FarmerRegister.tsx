import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User, Mail, Lock, Phone, Smartphone,
    Play, Square, RefreshCw, Check,
    Sprout, Tractor
} from "lucide-react";
import { toast } from "sonner";
import { LocationMap } from "./LocationMap";

export const FarmerRegister = () => {
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

    // Boundary mapping state
    const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [boundaryPoints, setBoundaryPoints] = useState<Array<{ lat: number; lng: number }>>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [mappingConfirmed, setMappingConfirmed] = useState(false);

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

        // Filter unique points
        const unique = boundaryPoints.filter((v, i, a) =>
            a.findIndex(t => t.lat.toFixed(5) === v.lat.toFixed(5) && t.lng.toFixed(5) === v.lng.toFixed(5)) === i
        );

        if (unique.length < 3) {
            toast.warning("You need to walk a perimeter. Please record at least 3 distinct corners of your farm.");
            setBoundaryPoints([]); // Reset if invalid
        } else {
            setBoundaryPoints(unique);
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

    const handleRegister = async () => {
        if (!formData.full_name || !formData.email || !formData.password || !mappingConfirmed) {
            toast.error("Please fill all details and confirm your farm mapping");
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
                    role: 'farmer',
                    phone: formData.phone,
                    farm_name: formData.farm_name,
                    crop_type: formData.crop_type,
                    boundary: boundaryPoints
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Registration failed");
            }

            const data = await res.json();
            toast.success("Registration successful! Welcome to CropSure.");

            localStorage.setItem('access_token', data.tokens.access_token);
            navigate('/dashboard');

        } catch (err: any) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);

    return (
        <div className="space-y-4 mt-4">
            {/* Personal Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-cyan-200">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 h-4 w-4 text-cyan-400" />
                        <Input
                            name="full_name"
                            placeholder="John Doe"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="pl-10 h-11 bg-slate-900/50 border-cyan-500/20 text-slate-100"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-cyan-200">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-cyan-400" />
                        <Input
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10 h-11 bg-slate-900/50 border-cyan-500/20 text-slate-100"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-cyan-200">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-4 w-4 text-cyan-400" />
                        <Input
                            name="phone"
                            placeholder="10-digit mobile"
                            maxLength={10}
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-10 h-11 bg-slate-900/50 border-cyan-500/20 text-slate-100"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-cyan-200">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-4 w-4 text-cyan-400" />
                        <Input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-10 h-11 bg-slate-900/50 border-cyan-500/20 text-slate-100"
                        />
                    </div>
                </div>
            </div>

            {/* Farm Details Section */}
            <div className="bg-cyan-500/5 border border-cyan-500/10 p-4 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
                    <Tractor className="h-5 w-5" />
                    Farm Information
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-slate-300 text-sm">Farm Name</Label>
                        <Input
                            name="farm_name"
                            placeholder="e.g. Green Valley Plot A"
                            value={formData.farm_name}
                            onChange={handleChange}
                            className="bg-slate-900/50 border-cyan-500/10 h-10 text-slate-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-300 text-sm">Major Crop</Label>
                        <select
                            name="crop_type"
                            value={formData.crop_type}
                            onChange={(e: any) => handleChange(e)}
                            className="w-full h-10 bg-slate-900/50 border border-cyan-500/10 rounded-md px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                        >
                            <option value="Maize">Maize</option>
                            <option value="Wheat">Wheat</option>
                            <option value="Rice">Rice</option>
                            <option value="Soybean">Soybean</option>
                            <option value="Sugarcane">Sugarcane</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Label className="text-cyan-200">Perimeter Mapping</Label>

                    {!isRecording && boundaryPoints.length === 0 && (
                        <Button
                            onClick={startMapping}
                            variant="outline"
                            className="w-full border-dashed border-cyan-500/30 bg-transparent text-cyan-400 hover:bg-cyan-500/10 h-16 gap-2"
                        >
                            <Play className="w-5 h-5 fill-current" /> Start Mapping Walk
                        </Button>
                    )}

                    {isRecording && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-orange-500/10 border border-orange-500/30 p-2 rounded-lg">
                                <span className="text-orange-400 text-sm animate-pulse flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    Recording Walk...
                                </span>
                                <Button onClick={stopMapping} size="sm" variant="destructive">
                                    Finish Walk
                                </Button>
                            </div>
                            <LocationMap currentPosition={currentPosition} boundary={boundaryPoints} isRecording={true} />
                        </div>
                    )}

                    {!isRecording && boundaryPoints.length > 0 && (
                        <div className="space-y-3">
                            <LocationMap currentPosition={null} boundary={boundaryPoints} isRecording={false} />
                            {!mappingConfirmed ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <Button onClick={() => setMappingConfirmed(true)} className="bg-green-600 hover:bg-green-700">
                                        <Check className="w-4 h-4 mr-2" /> Confirm
                                    </Button>
                                    <Button onClick={resetMapping} variant="outline" className="text-slate-400">
                                        <RefreshCw className="w-4 h-4 mr-2" /> Remap
                                    </Button>
                                </div>
                            ) : (
                                <div className="bg-green-500/10 border border-green-500/30 p-2 rounded-lg text-green-400 text-center text-sm flex items-center justify-center gap-2">
                                    <Check className="w-4 h-4" /> Boundary Confirmed
                                    <button onClick={() => setMappingConfirmed(false)} className="text-xs underline ml-2 opacity-50 hover:opacity-100">Edit</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Button
                onClick={handleRegister}
                disabled={isLoading || !mappingConfirmed}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 h-12 font-bold text-lg shadow-xl shadow-cyan-900/20"
            >
                {isLoading ? "Creating Account..." : "Register & Save Farm"}
            </Button>
        </div>
    );
};
