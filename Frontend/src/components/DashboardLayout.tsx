import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    ShieldCheck,
    FileText,
    AlertTriangle,
    Satellite,
    Search,
    Bell,
    Menu,
    Sprout,
    LogOut,
    User,
    ChevronDown,
    DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AnimatedParticles } from "@/components/AnimatedParticles";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role?: 'farmer' | 'admin' | 'officer';
}

const DashboardLayout = ({ children, role = 'farmer' }: DashboardLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const farmerNavItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { label: "Buy Policy", icon: ShieldCheck, path: "/buy-policy" },
        { label: "My Policies", icon: FileText, path: "/my-policies" },
        { label: "Claim Damage", icon: AlertTriangle, path: "/claim-damage" },
        { label: "Crop Health", icon: Satellite, path: "/crop-health" },
    ];

    const adminNavItems = [
        { label: "Overview", icon: LayoutDashboard, path: "/admin" },
        { label: "User Management", icon: User, path: "/admin?tab=users" },
        { label: "Insurance Rates", icon: DollarSign, path: "/admin?tab=rates" },
        { label: "Compensations", icon: FileText, path: "/admin?tab=compensation" },
        { label: "System Logs", icon: AlertTriangle, path: "/admin/logs" },
    ];

    const officerNavItems = [
        { label: "Review Claims", icon: Search, path: "/officer-review" },
        { label: "Field Reports", icon: FileText, path: "/officer/reports" },
    ];

    const navItems = role === 'admin' ? adminNavItems : role === 'officer' ? officerNavItems : farmerNavItems;

    const handleLogout = () => {
        localStorage.removeItem("token"); // Assuming clean up
        navigate("/");
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <AnimatedParticles />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-900/20 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 transition-transform duration-300 transform lg:transform-none flex flex-col",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                        <Sprout className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        CropSure
                    </span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item, idx) => {
                        // For admin items with query params, check exact match including search.
                        // For others, check user pathname match.
                        const isActive = role === 'admin'
                            ? (location.pathname + location.search) === item.path || (item.path === '/admin' && location.pathname === '/admin' && location.search === '')
                            : location.pathname === item.path;

                        return (
                            <button
                                key={idx}
                                onClick={() => navigate(item.path)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-green-500/10 to-cyan-500/10 text-white"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-cyan-400 rounded-r-full"></div>
                                )}
                                <item.icon className={cn("w-5 h-5", isActive ? "text-green-400" : "text-slate-500 group-hover:text-slate-300")} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>


            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-between px-6 lg:px-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 text-slate-400 hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden md:flex relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                placeholder="Search policies, claims, or documents..."
                                className="pl-10 bg-slate-950/50 border-slate-800 text-slate-200 focus:border-green-500/30 h-10 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-800"></div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer group p-1 pr-3 rounded-full hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-800">
                                    <Avatar className="w-9 h-9 border border-green-500/50 shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-all duration-300">
                                        <AvatarImage src="/placeholder-user.jpg" />
                                        <AvatarFallback className="bg-gradient-to-br from-green-600 to-emerald-700 text-white font-bold text-xs">{role === 'admin' ? 'AD' : 'RK'}</AvatarFallback>
                                    </Avatar>
                                    <div className="block text-left">
                                        <p className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors leading-none mb-1">
                                            {role === 'admin' ? 'System Admin' : role === 'officer' ? 'Field Officer' : 'Rajesh Kumar'}
                                        </p>
                                        <div className="flex items-center gap-1.5">
                                            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", role === 'admin' ? "bg-purple-500" : "bg-green-500")}></div>
                                            <p className={cn("text-xs font-medium leading-none", role === 'admin' ? "text-purple-400" : "text-green-400")}>
                                                {role === 'admin' ? 'Administrator' : role === 'officer' ? 'Officer' : 'Farmer'}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform duration-300 group-hover:rotate-180" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-800" />
                                <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="focus:bg-red-900/20 focus:text-red-400 text-red-400 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {children}
                </div>


            </main>
        </div>
    );
};

export default DashboardLayout;
