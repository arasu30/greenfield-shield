import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Satellite, TrendingDown, Calendar, Download, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const CropHealth = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [downloading, setDownloading] = useState<string | null>(null);

    const reports = [
        {
            id: "RPT-2024-087", policyId: "POL-2024-001", farmId: 1, cropType: "Rice", date: "15 Aug 2024",
            ndviBefore: 0.82, ndviAfter: 0.68, healthDrop: 17, status: "Attention Needed",
            analysis: "Significant decrease in vegetation health detected. Possible water stress or pest activity.",
        },
        {
            id: "RPT-2024-065", policyId: "POL-2024-012", farmId: 2, cropType: "Cotton", date: "10 Aug 2024",
            ndviBefore: 0.75, ndviAfter: 0.73, healthDrop: 3, status: "Healthy",
            analysis: "Normal seasonal variation. Crop health is within expected parameters.",
        },
    ];

    const handleDownloadReport = async (reportId: string, farmId: number) => {
        setDownloading(reportId);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
            const response = await fetch(`${backendUrl}/assess/report/${farmId}`);
            
            if (!response.ok) {
                // Try to parse the error message from the response
                let errorMessage = "Could not generate or download the report.";
                try {
                    const errorDetail = await response.json();
                    if (errorDetail && errorDetail.detail) {
                        errorMessage = errorDetail.detail;
                    }
                } catch (e) {
                    // Response might not be JSON
                }
                throw new Error(errorMessage);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `CropReport_${reportId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Success",
                description: "Your report has been downloaded successfully.",
            });
        } catch (error: any) {
            console.error("Download failed:", error);
            toast({
                variant: "destructive",
                title: "Download Failed",
                description: error.message || "Something went wrong. Please check your backend connection.",
            });
        } finally {
            setDownloading(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
            <div>
                <h1 className="page-title">Satellite Crop Health Reports</h1>
                <p className="page-subtitle">AI-powered analysis using satellite imagery</p>
            </div>

            <div className="space-y-5">
                {reports.map((report) => (
                    <Card key={report.id} className="glass-card-hover rounded-xl group">
                        <CardHeader className="pb-4 border-b border-white/[0.06]">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Satellite className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold text-white">{report.cropType} Health Report</CardTitle>
                                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" /> {report.date} • <span className="text-blue-400 font-medium">{report.id}</span>
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className={`text-xs ${report.status === 'Healthy' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border-amber-500/20'}`}>
                                    {report.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-white/[0.03] rounded-lg p-4">
                                    <p className="text-xs text-slate-500 font-medium mb-3">🛰️ NDVI Analysis</p>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className="text-slate-400">Before</span>
                                                <span className="font-semibold text-emerald-400">{report.ndviBefore}</span>
                                            </div>
                                            <Progress value={report.ndviBefore * 100} className="h-1.5" />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className="text-slate-400">After</span>
                                                <span className="font-semibold text-amber-400">{report.ndviAfter}</span>
                                            </div>
                                            <Progress value={report.ndviAfter * 100} className="h-1.5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/[0.03] rounded-lg p-4 flex flex-col items-center justify-center">
                                    <p className="text-xs text-slate-500 font-medium mb-3">📉 Health Impact</p>
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingDown className={`w-6 h-6 ${report.healthDrop > 10 ? 'text-red-400' : 'text-amber-400'}`} />
                                        <span className={`text-3xl font-semibold ${report.healthDrop > 10 ? 'text-red-400' : 'text-amber-400'}`}>
                                            {report.healthDrop}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">Health drop detected</p>
                                </div>
                            </div>

                            <div className="bg-white/[0.03] rounded-lg p-4 border-l-2 border-blue-500/40 mb-4">
                                <p className="text-xs text-blue-400 font-medium mb-1">💡 AI Analysis</p>
                                <p className="text-sm text-slate-400 leading-relaxed">{report.analysis}</p>
                            </div>

                            <div className="flex gap-3">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    disabled={downloading === report.id}
                                    onClick={() => handleDownloadReport(report.id, report.farmId)}
                                    className="border-white/[0.08] text-slate-300 hover:bg-white/[0.06] text-xs"
                                >
                                    {downloading === report.id ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-3.5 h-3.5 mr-1.5" />
                                            Download Report
                                        </>
                                    )}
                                </Button>
                                {report.status === "Attention Needed" && (
                                    <Button size="sm" onClick={() => navigate("/dashboard/claim-damage")}
                                        className="bg-amber-600 hover:bg-amber-500 text-white text-xs">
                                        📋 File Damage Claim
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CropHealth;
