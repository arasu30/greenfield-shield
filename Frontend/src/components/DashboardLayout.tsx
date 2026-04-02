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
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
            if (window.innerWidth < 1024) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch (e) { console.error("Failed to parse user data", e); }
        }
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const farmerNavItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { label: "Govt Schemes", icon: BookOpen, path: "/dashboard/schemes" },
        { label: "Buy Policy", icon: ShieldCheck, path: "/dashboard/buy-policy" },
        { label: "My Policies", icon: FileText, path: "/dashboard/my-policies" },
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
        <div className="flex flex-col min-h-screen bg-[#0a0f1e] text-slate-100 font-sans">
            <div className="flex flex-1 relative">
                {/* Sidebar */}
                <aside
                    className={cn(
                        "fixed lg:sticky top-0 lg:h-screen inset-y-0 left-0 z-50 bg-[#0d1326]/95 backdrop-blur-xl border-r border-white/[0.06] transition-all duration-300 flex flex-col",
                        sidebarOpen ? "translate-x-0 w-64 h-full" : "-translate-x-full lg:translate-x-0",
                        isCollapsed ? "lg:w-[72px]" : "lg:w-60"
                    )}
                >
                    {/* Logo */}
                    <div
                        className={cn("p-5 flex items-center gap-3 cursor-pointer relative", isCollapsed ? "justify-center px-3" : "")}
                        onClick={() => !isCollapsed && navigate(role === 'admin' ? '/admin' : role === 'officer' ? '/officer-review' : '/dashboard')}
                    >
                        <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                            <Sprout className="w-5 h-5 text-white" />
                        </div>
                        {!isCollapsed && (
                            <span className="text-lg font-semibold text-white whitespace-nowrap overflow-hidden">CropSure</span>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleCollapse(); }}
                            className="hidden lg:flex absolute -right-3 top-7 w-6 h-6 bg-[#151d35] border border-white/[0.08] rounded-full items-center justify-center hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors z-50"
                        >
                            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 space-y-1 mt-2 overflow-y-auto scrollbar-thin">
                        <TooltipProvider delayDuration={0}>
                            {navItems.map((item: any, idx) => {
                                if (item.type === 'header') {
                                    if (isCollapsed) return <div key={idx} className="h-px bg-white/[0.06] my-3 mx-2" />;
                                    return (
                                        <div key={idx} className="px-3 py-2 mt-5 mb-1 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                                            {item.label}
                                        </div>
                                    );
                                }

                                const isActive = item.path.includes('?') 
                                    ? (location.pathname + location.search) === item.path 
                                    : location.pathname === item.path && location.search === "";

                                const content = (
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                            isActive
                                                ? "bg-emerald-500/10 text-white"
                                                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]",
                                            isCollapsed ? "justify-center" : ""
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-500 rounded-r-full" />
                                        )}
                                        <item.icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300")} />
                                        {!isCollapsed && (
                                            <span className="text-sm font-medium whitespace-nowrap overflow-hidden">{item.label}</span>
                                        )}
                                    </button>
                                );

                                if (isCollapsed) {
                                    return (
                                        <Tooltip key={idx}>
                                            <TooltipTrigger asChild>{content}</TooltipTrigger>
                                            <TooltipContent side="right" className="bg-[#151d35] text-slate-200 border-white/[0.08]">
                                                {item.label}
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                }
                                return <div key={idx}>{content}</div>;
                            })}
                        </TooltipProvider>
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-3 border-t border-white/[0.06]">
                        <button
                            onClick={handleLogout}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200",
                                isCollapsed ? "justify-center" : ""
                            )}
                        >
                            <LogOut className="w-[18px] h-[18px] shrink-0" />
                            {!isCollapsed && <span className="text-sm font-medium">Log out</span>}
                        </button>
                    </div>
                </aside>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="sticky top-0 z-40 h-16 border-b border-white/[0.06] bg-[#0a0f1e]/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-8 shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="hidden md:flex relative w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-9 bg-white/[0.04] border-white/[0.06] text-slate-200 focus:border-emerald-500/30 h-9 rounded-lg text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                                <Bell className="w-[18px] h-[18px]" />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            </button>

                            <div className="h-6 w-px bg-white/[0.08]" />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-2.5 cursor-pointer group p-1 pr-2 rounded-lg hover:bg-white/[0.04] transition-all duration-200">
                                        <Avatar className="w-8 h-8 border border-white/[0.1]">
                                            <AvatarImage src="/placeholder-user.jpg" />
                                            <AvatarFallback className="bg-emerald-600 text-white font-medium text-xs">
                                                {user?.full_name
                                                    ? user.full_name.substring(0, 2).toUpperCase()
                                                    : (role === 'admin' ? 'AD' : role === 'officer' ? 'OF' : 'FM')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium text-slate-200 leading-none mb-0.5">
                                                {user?.full_name || (role === 'admin' ? 'Administrator' : role === 'officer' ? 'Field Officer' : 'Farmer')}
                                            </p>
                                            <p className="text-[11px] text-slate-500 leading-none capitalize">{role}</p>
                                        </div>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52 bg-[#151d35] border-white/[0.08] text-slate-200 p-1">
                                    <DropdownMenuLabel className="text-[11px] text-slate-500 uppercase tracking-wider px-3 py-2">My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/[0.06]" />
                                    <DropdownMenuItem onClick={() => navigate('/dashboard/profile')} className="focus:bg-white/[0.06] focus:text-white cursor-pointer py-2 rounded-md px-3 text-sm">
                                        <User className="mr-2 h-4 w-4 text-slate-500" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout} className="focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer py-2 rounded-md px-3 text-sm">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="flex-1 p-6 lg:p-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
