import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, User, MapPin, Check, X } from "lucide-react";
import { toast } from "sonner";
import { LocationMap } from "./LocationMap";

export const FarmerRegister = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationConfirmed, setLocationConfirmed] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLoadingLocation(false);
                setLocationConfirmed(false); // Reset confirmation if getting new location
                toast.success("Location detected successfully!");
            },
            (error) => {
                console.error(error);
                toast.error("Unable to retrieve your location");
                setLoadingLocation(false);
            }
        );
    };

    const handleRegister = () => {
        if (!name || phone.length !== 10 || !location || !locationConfirmed) {
            toast.error("Please fill all fields and confirm location");
            return;
        }
        // Mock registration
        toast.success("Registration successful! (Mock)");
        // Here you would navigate or log them in
    };

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
                <Label className="font-semibold text-cyan-200">Farm Location</Label>
                {!location ? (
                    <Button
                        onClick={handleGetLocation}
                        disabled={loadingLocation}
                        className="w-full bg-slate-800/50 border border-dashed border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-200 h-24 flex flex-col gap-2 transition-all duration-300"
                    >
                        <MapPin className={`w-6 h-6 ${loadingLocation ? 'animate-bounce' : ''}`} />
                        {loadingLocation ? "Detecting..." : "Turn on Location to Map Farm"}
                    </Button>
                ) : (
                    <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                        <LocationMap lat={location.lat} lng={location.lng} />

                        {!locationConfirmed ? (
                            <div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-lg">
                                <p className="text-sm text-cyan-100 mb-3 text-center">Is this location correct?</p>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setLocationConfirmed(true)}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                                        size="sm"
                                    >
                                        <Check className="w-4 h-4" /> Yes, Correct
                                    </Button>
                                    <Button
                                        onClick={handleGetLocation}
                                        variant="outline"
                                        className="flex-1 border-red-500/50 text-red-200 hover:bg-red-500/20 hover:text-red-100 gap-2 bg-transparent"
                                        size="sm"
                                    >
                                        <X className="w-4 h-4" /> Retry
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg flex items-center gap-2 text-green-200 justify-center">
                                <Check className="w-5 h-5" /> Location Confirmed
                                <Button
                                    onClick={() => setLocationConfirmed(false)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-1 text-xs text-green-200/50 hover:text-green-200"
                                >
                                    (Change)
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Button
                onClick={handleRegister}
                disabled={!locationConfirmed}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Register Farmer
            </Button>
        </div>
    );
};
