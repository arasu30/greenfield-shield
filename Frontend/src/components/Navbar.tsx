import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Leaf, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  userName?: string;
  userRole?: "farmer" | "officer" | "admin";
}

const Navbar = ({ userName = "Farmer", userRole = "farmer" }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-slate-900/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:shadow-green-400/50 transition-all duration-300">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-50 group-hover:text-green-300 transition-colors duration-300">CropSure AI</h1>
            <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Smart Crop Insurance</p>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {userRole === "farmer" && (
            <div className="hidden md:flex gap-4">
              <Button variant="ghost" asChild className="text-slate-300 hover:text-green-400 hover:bg-green-500/10 transition-all duration-300">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild className="text-slate-300 hover:text-green-400 hover:bg-green-500/10 transition-all duration-300">
                <Link to="/my-policies">My Policies</Link>
              </Button>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-11 w-11 rounded-full bg-slate-800/50 border border-slate-700/50 hover:border-green-500/50 hover:bg-slate-800 transition-all duration-300">
                <Avatar>
                  <AvatarFallback className="bg-green-600 text-white font-bold">
                    {userName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900 border border-slate-700 shadow-xl shadow-slate-900/50" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-slate-100">{userName}</p>
                  <p className="text-xs text-slate-400 capitalize">{userRole}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-slate-300 hover:text-red-400 hover:bg-red-500/10">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
