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
    <div className="min-h-screen bg-muted/30">
      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Satellite Crop Health Reports</h2>
          <p className="text-muted-foreground">AI-powered analysis using satellite imagery</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-info/10">
                      <Satellite className="w-6 h-6 text-info" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{report.cropType} Health Report</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {report.date} • Report ID: {report.id}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        NDVI Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Before</span>
                          <span className="text-2xl font-bold text-success">{report.ndviBefore}</span>
                        </div>
                        <Progress value={report.ndviBefore * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">After</span>
                          <span className="text-2xl font-bold text-warning">{report.ndviAfter}</span>
                        </div>
                        <Progress value={report.ndviAfter * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Health Change
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-32">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className={`w-8 h-8 ${report.healthDrop > 10 ? 'text-warning' : 'text-muted-foreground'}`} />
                        <span className={`text-5xl font-bold ${report.healthDrop > 10 ? 'text-warning' : 'text-muted-foreground'}`}>
                          {report.healthDrop}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Health drop detected</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-base">AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground">{report.analysis}</p>
                  </CardContent>
                </Card>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Report
                  </Button>
                  {report.status === "Attention Needed" && (
                    <Button size="sm" onClick={() => navigate("/claim-damage")}>
                      File Damage Claim
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <Satellite className="w-12 h-12 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">About NDVI (Normalized Difference Vegetation Index)</h3>
                <p className="text-sm text-muted-foreground">
                  NDVI measures vegetation health using satellite data. Values range from -1 to +1, 
                  where higher values indicate healthier vegetation. Our AI analyzes these changes to 
                  detect potential crop issues early.
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
