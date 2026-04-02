import { useState } from "react";
import { AnimatedParticles } from "@/components/AnimatedParticles";
import { FarmerLogin } from "@/components/FarmerLogin";
import { FarmerRegister } from "@/components/FarmerRegister";
import { OfficerRegister } from "@/components/OfficerRegister";
import { OfficerLogin } from "@/components/OfficerLogin";
import { Sprout, ShieldCheck, Users, Satellite, Brain, Shield, X, Github, Linkedin, Info, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Language, languageLabels, t } from "@/lib/i18n";
import Footer from "@/components/Footer";


type RoleType = "farmer" | "officer" | "admin";
type ViewType = "login" | "register";

const teamMembers = [
    { name: "Ilavarasu Thevar", avatar: "👤", linkedin: "https://www.linkedin.com/in/ilavarasu-thevar-8b239b307/", github: "https://github.com/arasu30" },
    { name: "Sudharsan Nadar", avatar: "👤", linkedin: "https://www.linkedin.com/in/sudharsan-nadar-645145313/", github: "https://github.com/sudhar25" },
    { name: "Tanish Srinivasan", avatar: "👤", linkedin: "https://www.linkedin.com/in/tanish-srinivasan/", github: "https://github.com/TanishSrinivasan" },
    { name: "Steve Jason", avatar: "👤", linkedin: "https://www.linkedin.com/in/steve-jason-aab14b25a/", github: "https://github.com/56steve" },
];

const Login = () => {
    const [selectedRole, setSelectedRole] = useState<RoleType>("farmer");
    const [view, setView] = useState<ViewType>("login");
    const [showAbout, setShowAbout] = useState(false);
    const [lang, setLang] = useState<Language>("en");
    const [langOpen, setLangOpen] = useState(false);

    const roles = [
        { id: "farmer" as RoleType, label: t(lang, "role.farmer"), icon: Sprout },
        { id: "officer" as RoleType, label: t(lang, "role.officer"), icon: ShieldCheck },
        { id: "admin" as RoleType, label: t(lang, "role.admin"), icon: Users },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0f1e] font-sans relative overflow-hidden">
            <div className="flex-1 flex flex-col lg:flex-row relative">
                <AnimatedParticles />

                {/* About Us Button — Top Left */}
                <button
                    onClick={() => setShowAbout(true)}
                    className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg glass-card hover:bg-white/[0.08] transition-all duration-200 text-slate-400 hover:text-white group"
                >
                    <Info className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium">{t(lang, "about.title")}</span>
                </button>

                {/* Language Selector — Top Right */}
                <div className="absolute top-6 right-6 z-50">
                    <button
                        onClick={() => setLangOpen(!langOpen)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card hover:bg-white/[0.08] transition-all duration-200 text-slate-400 hover:text-white"
                    >
                        <Globe className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium">{languageLabels[lang]}</span>
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", langOpen && "rotate-180")} />
                    </button>

                    {langOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                            <div className="absolute right-0 mt-2 w-44 glass-card border border-white/[0.08] rounded-xl p-1.5 z-50 animate-scale-in">
                                {(Object.entries(languageLabels) as [Language, string][]).map(([code, label]) => (
                                    <button
                                        key={code}
                                        onClick={() => { setLang(code); setLangOpen(false); }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                                            lang === code
                                                ? "bg-emerald-500/15 text-emerald-400"
                                                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                                        )}
                                    >
                                        <span className="font-medium">{label}</span>
                                        {lang === code && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* About Us Modal */}
                {showAbout && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" onClick={() => setShowAbout(false)} />
                        <div className="relative w-full max-w-lg glass-card rounded-2xl p-8 space-y-6 animate-scale-in border border-white/[0.08]">
                            <button onClick={() => setShowAbout(false)}
                                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center mx-auto">
                                    <Sprout className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium mb-3">{t(lang, "about.ourTeam")}</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {teamMembers.map((member, i) => (
                                        <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center hover:bg-white/[0.06] transition-all duration-200">
                                            <div className="text-3xl mb-2">{member.avatar}</div>
                                            <p className="text-sm font-medium text-white mb-3">{member.name}</p>
                                            <div className="flex items-center justify-center gap-2">
                                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200">
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                                <a href={member.github} target="_blank" rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all duration-200">
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Left Panel — Branding */}
                <div className="hidden lg:flex w-[45%] relative items-center justify-center p-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-blue-600/10" />
                    <div className="relative z-10 max-w-md space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center">
                                <Sprout className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-semibold text-white">CropSure</span>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-5xl font-semibold text-white leading-[1.1] tracking-tight">
                                {t(lang, "brand.headline")}{" "}
                                <span className="text-gradient-primary">{t(lang, "brand.headlineAccent")}</span>{" "}
                                {t(lang, "brand.headlineEnd")}
                            </h1>
                            <p className="text-lg text-slate-400 leading-relaxed">{t(lang, "brand.subtitle")}</p>
                        </div>
                        <div className="space-y-4 pt-2">
                            {[
                                { icon: Satellite, text: t(lang, "brand.feature1"), color: "text-blue-400" },
                                { icon: Brain, text: t(lang, "brand.feature2"), color: "text-purple-400" },
                                { icon: Shield, text: t(lang, "brand.feature3"), color: "text-emerald-400" },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center">
                                        <feature.icon className={`w-3.5 h-3.5 ${feature.color}`} />
                                    </div>
                                    <span className="text-sm text-slate-300">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel — Auth Form */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
                    <div className="w-full max-w-md space-y-8">
                        <div className="flex items-center gap-3 lg:hidden">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center">
                                <Sprout className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-semibold text-white">CropSure</span>
                        </div>

                        <div className="h-[72px] flex flex-col justify-end">
                            <h2 className="text-2xl font-semibold text-white animate-in slide-in-from-left-2 duration-300">
                                {view === "login" ? t(lang, "login.welcomeBack") : t(lang, "login.createAccount")}
                            </h2>
                            <p className="text-sm text-slate-400 mt-1 animate-in slide-in-from-left-4 duration-500">
                                {view === "login"
                                    ? (selectedRole === "farmer" ? t(lang, "login.signinPhone") : t(lang, "login.signinDashboard"))
                                    : t(lang, "login.registerStart")}
                            </p>
                        </div>

                        <div className="glass-card rounded-xl p-1.5 flex gap-1">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => { setSelectedRole(role.id); setView("login"); }}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        selectedRole === role.id
                                            ? "bg-emerald-500/15 text-emerald-400 shadow-sm"
                                            : "text-slate-400 hover:text-slate-300 hover:bg-white/[0.03]"
                                    )}
                                >
                                    <role.icon className="w-4 h-4" />
                                    {role.label}
                                </button>
                            ))}
                        </div>

                        <div className="glass-card rounded-2xl p-6 space-y-5 min-h-[300px] flex flex-col justify-center transition-all duration-300">
                            {selectedRole === "farmer" && view === "login" && <FarmerLogin lang={lang} />}
                            {selectedRole === "farmer" && view === "register" && <FarmerRegister lang={lang} />}
                            {selectedRole === "officer" && view === "login" && <OfficerLogin role="officer" lang={lang} />}
                            {selectedRole === "officer" && view === "register" && <OfficerRegister lang={lang} />}
                            {selectedRole === "admin" && <OfficerLogin role="admin" lang={lang} />}
                        </div>

                        <div className="text-center text-sm text-slate-500 min-h-[1.5rem] flex items-center justify-center">
                            {selectedRole !== "admin" ? (
                                <p>
                                    {view === "login" ? t(lang, "login.noAccount") : t(lang, "login.alreadyRegistered")}{" "}
                                    <button
                                        onClick={() => setView(view === "login" ? "register" : "login")}
                                        className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                                    >
                                        {view === "login" ? t(lang, "login.register") : t(lang, "login.signIn")}
                                    </button>
                                </p>
                            ) : (
                                <span className="opacity-0 select-none cursor-default">&nbsp;</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
