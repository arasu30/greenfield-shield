import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen bg-muted/30">
      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Claim Crop Damage</h2>
          <p className="text-muted-foreground">Submit your damage claim for AI-powered assessment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Damage Details</CardTitle>
                <CardDescription>Provide information about the crop damage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="policy">Select Policy *</Label>
                  <Select>
                    <SelectTrigger id="policy">
                      <SelectValue placeholder="Choose an active policy" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="POL-2024-001">POL-2024-001 - Rice (Kharif 2024)</SelectItem>
                      <SelectItem value="POL-2024-012">POL-2024-012 - Cotton (Kharif 2024)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disaster-type">Disaster Type *</Label>
                  <Select onValueChange={setDisasterType}>
                    <SelectTrigger id="disaster-type">
                      <SelectValue placeholder="Select disaster type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="Flood">Flood</SelectItem>
                      <SelectItem value="Drought">Drought</SelectItem>
                      <SelectItem value="Pest Attack">Pest Attack</SelectItem>
                      <SelectItem value="Cyclone">Cyclone</SelectItem>
                      <SelectItem value="Hailstorm">Hailstorm</SelectItem>
                      <SelectItem value="Fire">Fire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date of Incident *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affected-area">Affected Area (Acres) *</Label>
                  <Input
                    id="affected-area"
                    type="number"
                    step="0.1"
                    placeholder="Enter affected area"
                    value={affectedArea}
                    onChange={(e) => setAffectedArea(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the damage in detail..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photos">Upload Field Photos</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFiles(e.target.files)}
                    />
                    <label htmlFor="photos" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB each
                      </p>
                      {files && (
                        <p className="text-sm text-primary mt-2">
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
            <Card className="border-2 border-warning/50 bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertCircle className="w-5 h-5" />
                  Important
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>• Upload clear photos of damaged crops</p>
                <p>• Include images from multiple angles</p>
                <p>• AI will analyze satellite data automatically</p>
                <p>• Claims are processed within 48-72 hours</p>
                <p>• You'll receive updates via SMS</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <p>AI analyzes your photos and satellite data</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <p>Officer reviews the AI assessment</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <p>Compensation approved & transferred</p>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSubmit} className="w-full" size="lg">
              Submit Claim
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDamage;
