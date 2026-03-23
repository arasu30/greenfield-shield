import { CheckCircle2, ArrowRight } from "lucide-react";

interface SuccessOverlayProps {
    show: boolean;
    message: string;
    onContinue?: () => void;
}

export const SuccessOverlay = ({ show, message, onContinue }: SuccessOverlayProps) => {
    if (!show) return null;
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2 text-center">{message}</h2>
                <p className="text-slate-400 text-center text-sm mb-8">
                    Your account has been securely authenticated.
                </p>
                
                <button 
                    onClick={onContinue}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                >
                    Continue to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
