import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import StripeCheckout from "@/components/StripeCheckout";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clientSecret, amount, policyDetails } = location.state || {};

    if (!clientSecret || !amount || !policyDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h2 className="text-xl font-medium text-slate-300">Invalid session</h2>
                <Button onClick={() => navigate("/dashboard/buy-policy")} variant="outline">
                    Return to Buy Policy
                </Button>
            </div>
        );
    }

    const handlePaymentSuccess = async (paymentIntentId: string) => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/farmer/confirm-payment`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payment_intent_id: paymentIntentId,
                    ...policyDetails,
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to create policy");
            }
            toast.success("Policy purchased successfully!");
            setTimeout(() => navigate("/dashboard/my-policies"), 1500);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-up">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-slate-400">
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="page-title text-2xl mb-0">Complete Payment</h1>
                    <p className="text-slate-500 text-sm mt-1">Finalize your crop insurance policy purchase</p>
                </div>
            </div>

            <Card className="glass-card rounded-xl overflow-hidden">
                <CardHeader className="p-6 border-b border-white/[0.06] bg-emerald-500/5">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Payment Summary
                        </CardTitle>
                        <p className="text-2xl font-bold text-emerald-400">₹{amount.toLocaleString()}</p>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="mb-8 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500">Crop Type</p>
                                <p className="text-white font-medium">{policyDetails.crop_type}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Season</p>
                                <p className="text-white font-medium">{policyDetails.season}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Area</p>
                                <p className="text-white font-medium">{policyDetails.area_acres} Acres</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Coverage</p>
                                <p className="text-white font-medium">₹{policyDetails.coverage.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/[0.06] mb-8" />

                    <StripeCheckout 
                        clientSecret={clientSecret} 
                        amount={amount}
                        onSuccess={handlePaymentSuccess} 
                        onCancel={() => navigate(-1)} 
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentPage;
