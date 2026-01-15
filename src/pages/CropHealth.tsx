import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-100 dark:from-slate-950 dark:via-cyan-950 dark:to-slate-900">
      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-8 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-10">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">Satellite Crop Health Reports</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">AI-powered analysis using satellite imagery</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-2xl hover:shadow-cyan-200 dark:hover:shadow-cyan-900 transition-all duration-300 cursor-pointer group border border-slate-200 dark:border-slate-700 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-800 transform hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-cyan-100 dark:bg-cyan-900 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Satellite className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">{report.cropType} Health Report</CardTitle>
                      <CardDescription className="mt-2 text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {report.date} • <span className="font-semibold">{report.id}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${report.status === 'Healthy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'} font-semibold px-4 py-2`}>
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-900 border-green-200 dark:border-emerald-800 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
                        🛰️ NDVI Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Before</span>
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">{report.ndviBefore}</span>
                        </div>
                        <Progress value={report.ndviBefore * 100} className="h-2 bg-green-100 dark:bg-green-800" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">After</span>
                          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{report.ndviAfter}</span>
                        </div>
                        <Progress value={report.ndviAfter * 100} className="h-2 bg-amber-100 dark:bg-amber-800" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-900 border-amber-200 dark:border-orange-800 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        📉 Health Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-32">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingDown className={`w-8 h-8 ${report.healthDrop > 10 ? 'text-red-500' : 'text-amber-500'}`} />
                        <span className={`text-5xl font-bold ${report.healthDrop > 10 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {report.healthDrop}%
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Health drop detected</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-900 border-l-4 border-l-blue-500 dark:border-l-blue-400 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-blue-900 dark:text-blue-100">💡 AI Analysis & Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{report.analysis}</p>
                  </CardContent>
                </Card>

                <div className="mt-6 flex gap-3 flex-wrap">
                  <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 py-2.5 px-4 rounded-lg font-medium transition-all duration-300">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Report
                  </Button>
                  {report.status === "Attention Needed" && (
                    <Button size="sm" onClick={() => navigate("/claim-damage")} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 py-2.5 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                      📋 File Damage Claim
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-900 border-t-4 border-t-cyan-500 dark:border-t-cyan-400 shadow-xl">
          <CardContent className="py-7">
            <div className="flex items-start gap-5">
              <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-900 flex-shrink-0">
                <Satellite className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 text-cyan-900 dark:text-cyan-100">About NDVI (Normalized Difference Vegetation Index)</h3>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  NDVI measures vegetation health using satellite data. Values range from -1 to +1, where higher values indicate healthier vegetation. Our AI analyzes these changes to detect potential crop issues early, enabling you to take preventive action before significant damage occurs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CropHealth;
