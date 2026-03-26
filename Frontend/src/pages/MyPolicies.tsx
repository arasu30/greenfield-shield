import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Loader2, Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

interface Policy {
  id: number;
  crop_type: string;
  season: string;
  premium: number;
  coverage: number;
  status: string;
  start_date: string;
  end_date: string;
}

const MyPolicies = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/farmer/my-policies`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch policies");
        }

        const data = await response.json();
        setPolicies(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Could not load your policies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, [navigate]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-8 text-slate-300 hover:text-emerald-400 transition-all duration-300">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button> */}

      <div className="mb-10">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent mb-3">My Policies</h2>
        <p className="text-lg text-slate-300 font-medium">View and manage your insurance policies</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-emerald-400">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="text-xl font-medium">Loading your policies...</p>
          </div>
        ) : policies.length > 0 ? (
          policies.map((policy) => (
            <Card key={policy.id} className="backdrop-blur-2xl bg-slate-900/80 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 hover:border-emerald-400/50 hover:shadow-emerald-400/30 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1">
              <CardHeader className="pb-4 border-b border-emerald-500/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-emerald-500/20">
                      <FileText className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-emerald-100">{policy.crop_type}</CardTitle>
                      <CardDescription className="mt-2 text-slate-300">
                        Policy ID: <span className="font-semibold text-emerald-300">POL-{policy.id.toString().padStart(4, '0')}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${policy.status === 'Active' ? 'bg-emerald-600 text-emerald-50' : 'bg-slate-700 text-slate-200'} font-semibold px-4 py-2`}>
                    {policy.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">Season</p>
                    <p className="text-lg font-bold text-emerald-100">{policy.season}</p>
                  </div>
                  <div className="space-y-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">Duration</p>
                    <p className="text-sm font-bold text-emerald-100">
                      {formatDate(policy.start_date)} - {formatDate(policy.end_date)}
                    </p>
                  </div>
                  <div className="space-y-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">Premium paid</p>
                    <p className="text-lg font-bold text-emerald-300">₹{policy.premium.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Coverage</p>
                    <p className="text-lg font-bold text-cyan-300">₹{policy.coverage.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 border border-emerald-500/20 rounded-2xl backdrop-blur-sm">
            <FileText className="w-16 h-16 text-slate-600 mb-6" />
            <h3 className="text-2xl font-bold text-slate-300 mb-2">No Policies Found</h3>
            <p className="text-slate-500 mb-8 max-w-md text-center">You haven't purchased any crop insurance policies yet. Protect your harvest today.</p>
            <Button
              onClick={() => navigate("/dashboard/buy-policy")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Buy Your First Policy
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPolicies;
