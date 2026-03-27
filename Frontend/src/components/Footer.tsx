import { Sprout } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full py-6 border-t border-white/[0.04] text-center relative z-10">
            <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500">
                    <Sprout className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-400">CropSure</span>
                </div>
                <p className="text-xs text-slate-600">
                    &copy; {new Date().getFullYear()} CropSure. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
