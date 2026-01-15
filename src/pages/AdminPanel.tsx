import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, DollarSign, Settings, TrendingUp } from "lucide-react";

const AdminPanel = () => {
  const navigate = useNavigate();

  const users = [
    { id: "FRM-1234", name: "Rajesh Kumar", type: "Farmer", policies: 3, status: "Active" },
    { id: "FRM-5678", name: "Priya Sharma", type: "Farmer", policies: 2, status: "Active" },
    { id: "OFF-001", name: "Officer Ramesh", type: "Officer", policies: 0, status: "Active" },
  ];

  const cropRates = [
    { crop: "Rice", baseRate: 1200, season: "Kharif", coverage: "₹60,000/acre" },
    { crop: "Rice", baseRate: 1000, season: "Rabi", coverage: "₹50,000/acre" },
    { crop: "Wheat", baseRate: 1000, season: "Rabi", coverage: "₹50,000/acre" },
    { crop: "Cotton", baseRate: 1500, season: "Kharif", coverage: "₹75,000/acre" },
    { crop: "Sugarcane", baseRate: 1800, season: "Annual", coverage: "₹90,000/acre" },
  ];

  const compensations = [
    { id: "COMP-089", farmer: "Rajesh Kumar", amount: "₹2,04,000", crop: "Rice", date: "15 Aug 2024", status: "Paid" },
    { id: "COMP-085", farmer: "Amit Patel", amount: "₹3,69,000", crop: "Wheat", date: "14 Aug 2024", status: "Paid" },
    { id: "COMP-087", farmer: "Priya Sharma", amount: "₹1,35,000", crop: "Cotton", date: "13 Aug 2024", status: "Processing" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      <Navbar userName="Admin" userRole="admin" />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Logout
        </Button>

        <div className="mb-10">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-3">Admin Control Panel</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">Manage users, rates, system analytics & insurance operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <Card className="hover:shadow-2xl hover:shadow-purple-200 dark:hover:shadow-purple-900 transition-all duration-300 group border border-purple-200 dark:border-purple-800 backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-900 transform hover:-translate-y-1">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-purple-100 dark:bg-purple-900 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">127</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-2xl hover:shadow-green-200 dark:hover:shadow-green-900 transition-all duration-300 group border border-green-200 dark:border-green-800 backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-900 transform hover:-translate-y-1">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <DollarSign className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400">₹45L</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">Premiums Collected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-2xl hover:shadow-blue-200 dark:hover:shadow-blue-900 transition-all duration-300 group border border-blue-200 dark:border-blue-800 backdrop-blur-sm bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-900 transform hover:-translate-y-1">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-900 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">₹32L</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">Claims Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-2xl hover:shadow-amber-200 dark:hover:shadow-amber-900 transition-all duration-300 group border border-amber-200 dark:border-amber-800 backdrop-blur-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-900 transform hover:-translate-y-1">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-amber-100 dark:bg-amber-900 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Settings className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">245</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">Active Policies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-1 rounded-lg grid grid-cols-3 w-full border border-purple-200 dark:border-purple-800">
            <TabsTrigger value="users" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-md rounded-md font-semibold transition-all duration-300">👥 Users</TabsTrigger>
            <TabsTrigger value="rates" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-md rounded-md font-semibold transition-all duration-300">💹 Rates</TabsTrigger>
            <TabsTrigger value="compensation" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-md rounded-md font-semibold transition-all duration-300">💰 Compensation</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border border-slate-200 dark:border-slate-700 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 shadow-lg hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">👥 User Management</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">View and manage system users with active policies</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-900">
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">User ID</TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Name</TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Type</TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Active Policies</TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Status</TableHead>
                      <TableHead className="text-right text-slate-700 dark:text-slate-200 font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-purple-50 dark:hover:bg-purple-950 border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
                        <TableCell className="font-bold text-purple-600 dark:text-purple-400">{user.id}</TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium">{user.type}</Badge>
                        </TableCell>
                        <TableCell className="font-bold text-blue-600 dark:text-blue-400">{user.policies}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-600 dark:bg-green-700 text-white font-bold px-3 py-1">{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg font-semibold transition-all duration-200">👁️ View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rates">
            <Card className="border border-slate-200 dark:border-slate-700 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 shadow-lg hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">💹 Crop Insurance Rates</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">Manage premium rates and coverage amounts</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-900">
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Crop Type</TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Base Rate (per acre)</TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Season</TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Coverage Amount</TableHead>
                      <TableHead className="text-right text-slate-700 dark:text-slate-200 font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cropRates.map((rate, index) => (
                      <TableRow key={index} className="hover:bg-green-50 dark:hover:bg-green-950 border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
                        <TableCell className="font-bold text-green-600 dark:text-green-400">{rate.crop}</TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">₹{rate.baseRate}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium">{rate.season}</Badge>
                        </TableCell>
                        <TableCell className="font-bold text-blue-600 dark:text-blue-400">{rate.coverage}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg font-semibold transition-all duration-200">✏️ Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compensation">
            <Card className="border border-slate-200 dark:border-slate-700 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 shadow-lg hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">💰 Compensation History</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">Track all compensation payments and settlements</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-900">
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Compensation ID</TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Farmer</TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Crop</TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Amount</TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Date</TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-200 font-bold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {compensations.map((comp) => (
                      <TableRow key={comp.id} className="hover:bg-blue-50 dark:hover:bg-blue-950 border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
                        <TableCell className="font-bold text-blue-600 dark:text-blue-400">{comp.id}</TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{comp.farmer}</TableCell>
                        <TableCell className="font-medium text-slate-700 dark:text-slate-200">{comp.crop}</TableCell>
                        <TableCell className="font-bold text-green-600 dark:text-green-400 text-lg">{comp.amount}</TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-200">{comp.date}</TableCell>
                        <TableCell>
                          <Badge className={comp.status === "Paid" ? "bg-green-600 dark:bg-green-700 text-white font-bold px-3 py-1" : "bg-amber-600 dark:bg-amber-700 text-white font-bold px-3 py-1"}>
                            {comp.status === "Paid" ? "✅ Paid" : "⏳ Processing"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
