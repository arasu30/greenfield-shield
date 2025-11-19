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
    <div className="min-h-screen bg-muted/30">
      <Navbar userName="Admin" userRole="admin" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Logout
        </Button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage users, rates, and view system analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹45L</p>
                  <p className="text-sm text-muted-foreground">Premiums Collected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹32L</p>
                  <p className="text-sm text-muted-foreground">Claims Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-info/10">
                  <Settings className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">245</p>
                  <p className="text-sm text-muted-foreground">Active Policies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="rates">Crop Rates</TabsTrigger>
            <TabsTrigger value="compensation">Compensation Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage system users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Active Policies</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.type}</Badge>
                        </TableCell>
                        <TableCell>{user.policies}</TableCell>
                        <TableCell>
                          <Badge className="bg-success text-success-foreground">{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rates">
            <Card>
              <CardHeader>
                <CardTitle>Crop Insurance Rates</CardTitle>
                <CardDescription>Manage premium rates and coverage amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crop Type</TableHead>
                      <TableHead>Base Rate (per acre)</TableHead>
                      <TableHead>Season</TableHead>
                      <TableHead>Coverage Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cropRates.map((rate, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{rate.crop}</TableCell>
                        <TableCell>₹{rate.baseRate}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{rate.season}</Badge>
                        </TableCell>
                        <TableCell className="font-medium text-primary">{rate.coverage}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compensation">
            <Card>
              <CardHeader>
                <CardTitle>Compensation History</CardTitle>
                <CardDescription>Track all compensation payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Compensation ID</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {compensations.map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell className="font-medium">{comp.id}</TableCell>
                        <TableCell>{comp.farmer}</TableCell>
                        <TableCell>{comp.crop}</TableCell>
                        <TableCell className="font-medium text-success">{comp.amount}</TableCell>
                        <TableCell>{comp.date}</TableCell>
                        <TableCell>
                          <Badge className={comp.status === "Paid" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                            {comp.status}
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
