import { Facebook, Github, Instagram, Mail, Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full py-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent backdrop-blur-xl text-center relative z-10 transition-all duration-300">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[30%] w-64 h-64 bg-green-500/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[20%] right-[30%] w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Branding */}
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-6 tracking-wide drop-shadow-sm">
                    CropSure.com
                </h2>

                {/* Social Media Icons */}
                <div className="flex justify-center gap-6 mb-8">
                    <a href="#" className="p-3 bg-slate-900/50 rounded-full border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300">
                        <Github className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-3 bg-slate-900/50 rounded-full border border-slate-800 text-slate-400 hover:text-blue-600 hover:border-blue-600/50 hover:bg-blue-600/10 hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-1 transition-all duration-300">
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-3 bg-slate-900/50 rounded-full border border-slate-800 text-slate-400 hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/10 hover:shadow-lg hover:shadow-pink-500/20 hover:-translate-y-1 transition-all duration-300">
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-3 bg-slate-900/50 rounded-full border border-slate-800 text-slate-400 hover:text-green-400 hover:border-green-400/50 hover:bg-green-400/10 hover:shadow-lg hover:shadow-green-400/20 hover:-translate-y-1 transition-all duration-300">
                        <Mail className="w-5 h-5" />
                    </a>
                </div>

                {/* Copyright */}
                <div className="text-slate-500 text-sm font-medium">
                    <p className="flex items-center justify-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                        Copyright &copy; {new Date().getFullYear()} All rights reserved | Made with
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-current animate-pulse inline-block" />
                        by <span className="text-green-400 font-semibold hover:text-green-300 cursor-pointer transition-colors">CropSure.com</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
