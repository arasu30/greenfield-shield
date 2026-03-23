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
    BookOpen,
    User,
    ChevronDown,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    AlertCircle,
    Smartphone,
    Calendar,
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
import Footer from "@/components/Footer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role?: 'farmer' | 'admin' | 'officer';
}

const DashboardLayout = ({ children, role = 'farmer' }: DashboardLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem("sidebarCollapsed");
        return saved ? JSON.parse(saved) : false;
    });

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
    };

    const [user, setUser] = useState<any>(null);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);

        // Load user from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const farmerNavItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { label: "Buy Policy", icon: ShieldCheck, path: "/dashboard/buy-policy" },
        { label: "My Policies", icon: FileText, path: "/dashboard/my-policies" },
        { label: "Govt Schemes", icon: BookOpen, path: "/dashboard/schemes" },
        { label: "Claim Damage", icon: AlertTriangle, path: "/dashboard/claim-damage" },
        { label: "Crop Health", icon: Satellite, path: "/dashboard/crop-health" },
    ];

    const adminNavItems = [
        { label: "Main", type: 'header' },
        { label: "Overview", icon: LayoutDashboard, path: "/admin" },
        { label: "User Management", icon: User, path: "/admin?tab=users" },
        { label: "Insurance Rates", icon: DollarSign, path: "/admin?tab=rates" },

        { label: "Finance", type: 'header' },
        { label: "Compensations", icon: DollarSign, path: "/admin?tab=compensation" },
        // { label: "System Logs", icon: AlertTriangle, path: "/admin/logs" },
    ];

    const officerNavItems = [
        { label: "Claims Management", type: 'header' },
        { label: "Pending Review", icon: AlertCircle, path: "/officer-review?status=pending" },
        { label: "Approved Today", icon: CheckCircle, path: "/officer-review?status=approved" },
        { label: "Rejected Claims", icon: XCircle, path: "/officer-review?status=rejected" },
        { label: "Total Claims", icon: AlertCircle, path: "/officer-review?status=all" },

        { label: "Policy Management", type: 'header' },
        { label: "Active Policies", icon: ShieldCheck, path: "/officer/policies?status=active" },
        { label: "Pending Policies", icon: Calendar, path: "/officer/policies?status=pending" },
        { label: "Expired Policies", icon: ShieldCheck, path: "/officer/policies?status=expired" },
        { label: "All Policies", icon: FileText, path: "/officer/policies" },

        { label: "Reports", type: 'header' },
        { label: "Farmers", icon: User, path: "/officer/farmers" },
    ];

    const navItems = role === 'admin' ? adminNavItems : role === 'officer' ? officerNavItems : farmerNavItems;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <AnimatedParticles />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-900/20 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
            </div>

            {/* Middle Section: Sidebar + Main Content */}
            <div className="flex flex-1 relative z-10">
                {/* Sidebar */}
                <aside
                    className={cn(
                        "fixed lg:sticky top-0 lg:h-screen inset-y-0 left-0 z-50 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 flex flex-col rounded-br-[40px]",
                        sidebarOpen ? "translate-x-0 w-64 h-full" : "-translate-x-full lg:translate-x-0",
                        isCollapsed ? "lg:w-20" : "lg:w-64"
                    )}
                >
                    {/* Header / Toggle */}
                    <div
                        className={cn("p-6 flex items-center gap-3 cursor-pointer relative", isCollapsed ? "justify-center px-2" : "")}
                        onClick={() => !isCollapsed && navigate(role === 'admin' ? '/admin' : role === 'officer' ? '/officer-review' : '/dashboard')}
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-green-500/20 shrink-0">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>

                        {!isCollapsed && (
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent whitespace-nowrap overflow-hidden transition-all duration-300">
                                CropSure
                            </span>
                        )}

                        {/* Desktop Collapse Toggle */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleCollapse();
                            }}
                            className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full items-center justify-center hover:bg-slate-700 hover:text-white text-slate-400 transition-colors shadow-lg z-50"
                        >
                            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                        <TooltipProvider delayDuration={0}>
                            {navItems.map((item: any, idx) => {
                                if (item.type === 'header') {
                                    if (isCollapsed) return <div key={idx} className="h-px bg-slate-800 my-2 mx-4" />;
                                    return (
                                        <div key={idx} className="px-4 py-2 mt-4 mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            {item.label}
                                        </div>
                                    );
                                }

                                const isActive = (location.pathname + location.search) === item.path || (item.path.indexOf('?') === -1 && location.pathname === item.path);

                                const content = (
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                            isActive
                                                ? "bg-gradient-to-r from-green-500/10 to-cyan-500/10 text-white"
                                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                                            isCollapsed ? "justify-center" : ""
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-cyan-400 rounded-r-full"></div>
                                        )}
                                        <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-green-400" : "text-slate-500 group-hover:text-slate-300")} />

                                        {!isCollapsed && (
                                            <span className="font-medium whitespace-nowrap overflow-hidden">{item.label}</span>
                                        )}
                                    </button>
                                );

                                if (isCollapsed) {
                                    return (
                                        <Tooltip key={idx}>
                                            <TooltipTrigger asChild>{content}</TooltipTrigger>
                                            <TooltipContent side="right" className="bg-slate-800 text-slate-200 border-slate-700">
                                                {item.label}
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                }

                                return <div key={idx}>{content}</div>;
                            })}
                        </TooltipProvider>
                    </nav>

                    {/* Footer / User Profile (Sidebar Bottom) */}
                    {/* Can stay empty or have simple profile if needed later */}
                </aside>

                {/* Overlay for mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="sticky top-0 z-40 h-20 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 shrink-0 transition-all duration-300">
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
                                            <AvatarFallback className="bg-gradient-to-br from-green-600 to-emerald-700 text-white font-bold text-xs">
                                                {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : (role === 'admin' ? 'AD' : 'RK')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="block text-left hidden md:block">
                                            <p className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors leading-none mb-1">
                                                {user?.full_name || (role === 'admin' ? 'Administrator' : role === 'officer' ? 'Field Officer' : 'User')}
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
                                <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200 p-1 shadow-2xl">
                                    <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-widest px-3 py-2">My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-slate-800" />
                                    <DropdownMenuItem onClick={() => navigate('/dashboard/profile')} className="focus:bg-slate-800 focus:text-white cursor-pointer py-2.5 rounded-lg px-3 group/item">
                                        <User className="mr-3 h-4 w-4 text-slate-500 group-hover/item:text-green-400" />
                                        <span className="font-medium">Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout} className="focus:bg-red-900/20 focus:text-red-400 text-red-400 cursor-pointer py-2.5 rounded-lg px-3 group/item">
                                        <LogOut className="mr-3 h-4 w-4 text-red-400 group-hover/item:translate-x-1 transition-transform" />
                                        <span className="font-medium">Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Scrollable Page Content */}
                    <div className="flex-1 p-6 lg:p-12">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer - Full Width Below Sidebar */}
            <Footer />
        </div>
    );
};

export default DashboardLayout;
