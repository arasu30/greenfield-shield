import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileText, AlertTriangle, Satellite, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: "Buy Insurance Policy",
      description: "Protect your crops with our AI-powered insurance",
      icon: ShieldCheck,
      color: "text-primary",
      bgColor: "bg-primary/10",
      path: "/buy-policy",
    },
    {
      title: "My Policies",
      description: "View and manage your active policies",
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
      path: "/my-policies",
    },
    {
      title: "Claim Crop Damage",
      description: "File a claim for crop damage or losses",
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
      path: "/claim-damage",
    },
    {
      title: "Satellite Crop Health",
      description: "View AI-analyzed satellite reports",
      icon: Satellite,
      color: "text-info",
      bgColor: "bg-info/10",
      path: "/crop-health",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar userName="Rajesh Kumar" userRole="farmer" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, Rajesh!</h2>
          <p className="text-muted-foreground">Manage your crop insurance and monitor your farm health</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary/50"
              onClick={() => navigate(card.path)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`w-8 h-8 ${card.color}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="mt-4">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">3</p>
              <p className="text-sm text-muted-foreground mt-2">Currently protecting 15 acres</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pending Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-warning">1</p>
              <p className="text-sm text-muted-foreground mt-2">Under review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Crop Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-success">85%</p>
              <p className="text-sm text-muted-foreground mt-2">Based on latest satellite data</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
