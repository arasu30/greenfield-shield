import React, { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Shield } from 'lucide-react';
import { toast } from 'sonner';
import stripePromise from '@/lib/stripe';

interface StripeCheckoutFormProps {
    clientSecret: string;
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
    onCancel: () => void;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({ clientSecret, amount, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;
        setIsProcessing(true);
        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: { return_url: `${window.location.origin}/dashboard/my-policies` },
                redirect: 'if_required',
            });
            if (error) { toast.error(error.message || 'Payment failed'); }
            else if (paymentIntent && paymentIntent.status === 'succeeded') { toast.success('Payment successful!'); onSuccess(paymentIntent.id); }
        } catch (err) { toast.error('Payment processing failed'); }
        finally { setIsProcessing(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/15 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-400" />
                <div>
                    <p className="text-sm font-medium text-emerald-300">Secure Payment</p>
                    <p className="text-xs text-emerald-400/70">Encrypted and secure</p>
                </div>
            </div>
            <PaymentElement options={{ layout: 'tabs', paymentMethodOrder: ['card', 'apple_pay', 'google_pay'] }} />
            <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}
                    className="flex-1 border-white/[0.08] text-slate-300 hover:bg-white/[0.06]">Cancel</Button>
                <Button type="submit" disabled={!stripe || isProcessing}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">
                    {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>)
                        : (<><CreditCard className="w-4 h-4 mr-2" /> Pay ₹{(amount / 100).toFixed(2)}</>)}
                </Button>
            </div>
        </form>
    );
};

interface StripeCheckoutProps {
    clientSecret: string;
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
    onCancel: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ clientSecret, amount, onSuccess, onCancel }) => {
    const options = {
        clientSecret,
        appearance: {
            theme: 'night' as const,
            variables: {
                colorPrimary: '#10b981',
                colorBackground: '#111827',
                colorText: '#f9fafb',
                colorDanger: '#ef4444',
                fontFamily: 'Inter, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
            },
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <StripeCheckoutForm clientSecret={clientSecret} amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
    );
};

export default StripeCheckout;