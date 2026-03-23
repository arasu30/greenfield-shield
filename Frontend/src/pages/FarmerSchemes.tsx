import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, FileText, Gift, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Scheme {
  id: number;
  name: string;
  description: string;
  eligibility_criteria: string;
  benefits: string;
  required_documents: string;
  is_active: boolean;
}

const FarmerSchemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            navigate("/login");
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/schemes`, {
            headers: {
              "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch schemes");
        }

        const data = await response.json();
        setSchemes(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Could not load government schemes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchemes();
  }, [navigate]);

  const handleApply = (schemeId: number, schemeName: string) => {
    toast.info(`Applying for ${schemeName}... Redirecting to policy purchase.`);
    navigate(`/dashboard/buy-policy?schemeId=${schemeId}&schemeName=${encodeURIComponent(schemeName)}`);
  };

  return (
    <div className="container mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="mb-10">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent mb-3">Govt Schemes & Subsidies</h2>
        <p className="text-lg text-slate-300 font-medium">Discover and apply for agricultural initiatives that can boost your farm's growth</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-emerald-400">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="text-xl font-medium">Loading available schemes...</p>
          </div>
        ) : schemes.length > 0 ? (
          schemes.map((scheme) => (
            <Card key={scheme.id} className="backdrop-blur-2xl bg-slate-900/80 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 hover:border-emerald-400/50 hover:shadow-emerald-400/30 transition-all duration-300 group flex flex-col">
              <CardHeader className="pb-4 border-b border-emerald-500/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-all duration-300 shrink-0">
                      <BookOpen className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-emerald-100 leading-tight">{scheme.name}</CardTitle>
                    </div>
                  </div>
                  <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold px-3 py-1 whitespace-nowrap">
                    Open
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex-1 flex flex-col">
                <p className="text-slate-300 text-sm leading-relaxed mb-6">{scheme.description}</p>
                
                <div className="space-y-4 mb-8 flex-1">
                  {scheme.benefits && (
                    <div className="flex items-start gap-3">
                      <Gift className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wide mb-1">Benefits</p>
                        <p className="text-sm text-slate-200">{scheme.benefits}</p>
                      </div>
                    </div>
                  )}
                  
                  {scheme.eligibility_criteria && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1">Eligibility</p>
                        <p className="text-sm text-slate-200">{scheme.eligibility_criteria}</p>
                      </div>
                    </div>
                  )}
                  
                  {scheme.required_documents && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1">Required Documents</p>
                        <p className="text-sm text-slate-200">{scheme.required_documents}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => handleApply(scheme.id, scheme.name)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold transition-all duration-300 shadow-lg shadow-emerald-500/20 mt-auto"
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-900/50 border border-emerald-500/20 rounded-2xl backdrop-blur-sm">
            <Info className="w-16 h-16 text-slate-600 mb-6" />
            <h3 className="text-2xl font-bold text-slate-300 mb-2">No Schemes Available</h3>
            <p className="text-slate-500 max-w-md text-center">Currently, there are no active government schemes to display. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerSchemes;
