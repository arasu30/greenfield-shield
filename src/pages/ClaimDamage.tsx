import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AnimatedParticles } from "@/components/AnimatedParticles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const ClaimDamage = () => {
  const navigate = useNavigate();
  const [disasterType, setDisasterType] = useState("");
  const [date, setDate] = useState("");
  const [affectedArea, setAffectedArea] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = () => {
    if (!disasterType || !date || !affectedArea) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Claim submitted successfully!");
    toast.info("AI analysis in progress. You'll receive updates soon.");
    setTimeout(() => {
      navigate("/my-policies");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-900 to-slate-950 relative overflow-hidden">
      {/* Animated background particles */}
      <AnimatedParticles />

      {/* Gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse" style={{animationDelay: '2s'}}></div>

      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-8 text-slate-300 hover:text-red-400 transition-all duration-300">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-10">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-3">Claim Crop Damage</h2>
          <p className="text-lg text-slate-300 font-medium">Submit your damage claim for AI-powered assessment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="backdrop-blur-2xl bg-slate-900/80 border border-red-500/30 shadow-2xl shadow-red-500/20 hover:border-red-400/50 hover:shadow-red-400/30 transition-all duration-300">
              <CardHeader className="pb-4 border-b border-red-500/20">
                <CardTitle className="text-2xl font-bold text-red-100">Damage Details</CardTitle>
                <CardDescription className="text-slate-300">Provide information about the crop damage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="policy" className="font-semibold text-red-200">Select Policy *</Label>
                  <Select>
                    <SelectTrigger id="policy" className="py-6 bg-slate-800/50 border border-red-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:border-red-400 focus:ring-2 focus:ring-red-500/50">
                      <SelectValue placeholder="Choose an active policy" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border border-red-500/30">
                      <SelectItem value="POL-2024-001">POL-2024-001 - Rice (Kharif 2024)</SelectItem>
                      <SelectItem value="POL-2024-012">POL-2024-012 - Cotton (Kharif 2024)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disaster-type" className="font-semibold text-red-200">Disaster Type *</Label>
                  <Select onValueChange={setDisasterType}>
                    <SelectTrigger id="disaster-type" className="py-6 bg-slate-800/50 border border-red-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:border-red-400 focus:ring-2 focus:ring-red-500/50">
                      <SelectValue placeholder="Select disaster type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border border-red-500/30">
                      <SelectItem value="Flood">💧 Flood</SelectItem>
                      <SelectItem value="Drought">🏜️ Drought</SelectItem>
                      <SelectItem value="Pest Attack">🐛 Pest Attack</SelectItem>
                      <SelectItem value="Cyclone">🌪️ Cyclone</SelectItem>
                      <SelectItem value="Hailstorm">❄️ Hailstorm</SelectItem>
                      <SelectItem value="Fire">🔥 Fire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="font-semibold text-red-200">Date of Incident *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="py-6 bg-slate-800/50 border border-red-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:border-red-400 focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affected-area" className="font-semibold text-red-200">Affected Area (Acres) *</Label>
                  <Input
                    id="affected-area"
                    type="number"
                    step="0.1"
                    placeholder="Enter affected area"
                    value={affectedArea}
                    onChange={(e) => setAffectedArea(e.target.value)}
                    className="py-6 bg-slate-800/50 border border-red-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:border-red-400 focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-semibold text-red-200">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the damage in detail..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="py-3 bg-slate-800/50 border border-red-500/30 text-slate-100 placeholder-slate-500 rounded-lg focus:border-red-400 focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photos" className="font-semibold text-red-200">Upload Field Photos</Label>
                  <div className="border-2 border-dashed border-red-500/30 rounded-lg p-6 text-center hover:border-red-400/50 transition-colors cursor-pointer bg-red-500/5">
                    <input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFiles(e.target.files)}
                    />
                    <label htmlFor="photos" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-red-400" />
                      <p className="text-sm text-red-300">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-red-300/60 mt-1">
                        PNG, JPG up to 10MB each
                      </p>
                      {files && (
                        <p className="text-sm text-red-400 mt-2">
                          {files.length} file(s) selected
                        </p>
                      )}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="backdrop-blur-2xl bg-red-500/10 border-2 border-red-500/40 hover:border-red-400/60 transition-all duration-300">
              <CardHeader className="border-b border-red-500/30">
                <CardTitle className="flex items-center gap-2 text-red-300">
                  <AlertCircle className="w-5 h-5" />
                  Important
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-red-200/80 pt-4">
                <p>• Upload clear photos of damaged crops</p>
                <p>• Include images from multiple angles</p>
                <p>• AI will analyze satellite data automatically</p>
                <p>• Claims are processed within 48-72 hours</p>
                <p>• You'll receive updates via SMS</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-2xl bg-red-950/50 border border-red-500/30 shadow-2xl shadow-red-500/20">
              <CardHeader className="border-b border-red-500/30">
                <CardTitle className="text-lg text-red-200">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-red-200/80 pt-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0 border border-red-500/50">
                    <span className="text-xs font-bold text-red-300">1</span>
                  </div>
                  <p>AI analyzes your photos and satellite data</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0 border border-red-500/50">
                    <span className="text-xs font-bold text-red-300">2</span>
                  </div>
                  <p>Officer reviews the AI assessment</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0 border border-red-500/50">
                    <span className="text-xs font-bold text-red-300">3</span>
                  </div>
                  <p>Compensation approved & transferred</p>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50" size="lg">
              Submit Claim
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDamage;
