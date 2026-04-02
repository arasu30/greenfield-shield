const Footer = () => {
    return (
        <footer className="w-full pt-24 pb-12 border-t border-white/[0.04] relative overflow-hidden bg-[#050811] z-50">
            <div className="container mx-auto px-6 relative z-10">
                {/* Copyright Row */}
                <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/[0.03] pb-12 mb-12">
                    <p className="text-slate-500 text-xs font-medium tracking-wide">
                        &copy; 2026 Cropsure.All rights reserved.
                    </p>
                    <div className="flex gap-8 mt-6 md:mt-0">
                        <a href="#" className="text-slate-500 hover:text-emerald-400 transition-all duration-300 text-xs">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-emerald-400 transition-all duration-300 text-xs">Terms of Service</a>
                        <a href="#" className="text-slate-500 hover:text-emerald-400 transition-all duration-300 text-xs">Cookie Policy</a>
                    </div>
                </div>

                {/* Big Logo / Brand Name */}
                <div className="text-center py-12 select-none pointer-events-none relative overflow-visible w-full flex justify-center">
                    <h2 className="text-[clamp(5rem,18vw,22rem)] font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-transparent opacity-40 whitespace-nowrap px-10">
                        Cropsure
                    </h2>
                </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/5 blur-[140px] rounded-full -mt-96 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        </footer>
    );
};

export default Footer;
