import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AnimatedParticles } from "@/components/AnimatedParticles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Satellite, TrendingDown, Calendar, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const CropHealth = () => {
  const navigate = useNavigate();

  const reports = [
    {
      id: "RPT-2024-087",
      policyId: "POL-2024-001",
      cropType: "Rice",
      date: "15 Aug 2024",
      ndviBefore: 0.82,
      ndviAfter: 0.68,
      healthDrop: 17,
      status: "Attention Needed",
      analysis: "Significant decrease in vegetation health detected. Possible water stress or pest activity.",
    },
    {
      id: "RPT-2024-065",
      policyId: "POL-2024-012",
      cropType: "Cotton",
      date: "10 Aug 2024",
      ndviBefore: 0.75,
      ndviAfter: 0.73,
      healthDrop: 3,
      status: "Healthy",
      analysis: "Normal seasonal variation. Crop health is within expected parameters.",
    },
  ];

  const getStatusColor = (status: string) => {
    if (status === "Healthy") return "bg-success text-success-foreground";
    if (status === "Attention Needed") return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-900 to-slate-950 relative overflow-hidden">
      {/* Animated background particles */}
      <AnimatedParticles />

      {/* Gradient blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse" style={{animationDelay: '2s'}}></div>

      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-8 text-slate-300 hover:text-cyan-400 transition-all duration-300">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-10">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">Satellite Crop Health Reports</h2>
          <p className="text-lg text-slate-300 font-medium">AI-powered analysis using satellite imagery</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="backdrop-blur-2xl bg-slate-900/80 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 hover:border-cyan-400/50 hover:shadow-cyan-400/30 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1">
              <CardHeader className="pb-4 border-b border-cyan-500/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-cyan-500/20">
                      <Satellite className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-cyan-100">{report.cropType} Health Report</CardTitle>
                      <CardDescription className="mt-2 text-slate-300 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {report.date} • <span className="font-semibold text-cyan-300">{report.id}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${report.status === 'Healthy' ? 'bg-emerald-600 text-emerald-50' : 'bg-amber-600 text-amber-50'} font-semibold px-4 py-2`}>
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="backdrop-blur-md bg-emerald-500/10 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                    <CardHeader className="pb-3 border-b border-emerald-500/20">
                      <CardTitle className="text-sm font-medium text-emerald-300">
                        🛰️ NDVI Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-emerald-300">Before</span>
                          <span className="text-2xl font-bold text-emerald-400">{report.ndviBefore}</span>
                        </div>
                        <Progress value={report.ndviBefore * 100} className="h-2 bg-emerald-900 " />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-amber-300">After</span>
                          <span className="text-2xl font-bold text-amber-400">{report.ndviAfter}</span>
                        </div>
                        <Progress value={report.ndviAfter * 100} className="h-2 bg-amber-900" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-md bg-amber-500/10 border border-amber-500/30 shadow-lg shadow-amber-500/20">
                    <CardHeader className="pb-3 border-b border-amber-500/20">
                      <CardTitle className="text-sm font-medium text-amber-300">
                        📉 Health Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-32 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingDown className={`w-8 h-8 ${report.healthDrop > 10 ? 'text-red-400' : 'text-amber-400'}`} />
                        <span className={`text-5xl font-bold ${report.healthDrop > 10 ? 'text-red-400' : 'text-amber-400'}`}>
                          {report.healthDrop}%
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 font-medium">Health drop detected</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="backdrop-blur-md bg-cyan-500/10 border border-cyan-500/30 border-l-4 border-l-cyan-400 shadow-lg shadow-cyan-500/20">
                  <CardHeader className="pb-3 border-b border-cyan-500/20">
                    <CardTitle className="text-base text-cyan-300">💡 AI Analysis & Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{report.analysis}</p>
                  </CardContent>
                </Card>

                <div className="mt-6 flex gap-3 flex-wrap">
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white border-0 py-2.5 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/50">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Report
                  </Button>
                  {report.status === "Attention Needed" && (
                    <Button size="sm" onClick={() => navigate("/claim-damage")} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 py-2.5 px-4 rounded-lg font-medium shadow-lg hover:shadow-amber-500/50 transition-all duration-300">
                      📋 File Damage Claim
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropHealth;
