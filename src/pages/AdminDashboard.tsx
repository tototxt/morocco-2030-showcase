import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  Users,
  Search,
  Shield,
  Mail,
  User,
  Calendar,
  Ticket,
  DollarSign,
  ScanFace,
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
}

interface PurchaseWithDetails {
  id: string;
  ticket_id: string;
  holder_name: string;
  holder_email: string;
  category_name: string;
  block: string;
  row_number: string;
  seat_number: string;
  price: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  user_id: string;
  matches: {
    home_team: string;
    away_team: string;
    match_date: string;
    stadium: string;
  } | null;
}

interface FaceEnrollment {
  id: string;
  user_id: string;
  purchase_id: string | null;
  is_verified: boolean;
  last_verification_result: string | null;
  last_verification_at: string | null;
}

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [purchases, setPurchases] = useState<PurchaseWithDetails[]>([]);
  const [faceEnrollments, setFaceEnrollments] = useState<FaceEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isAdmin, signOut, isLoading: authLoading } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !isAdmin) return;

      // Fetch profiles
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      setProfiles(profileData || []);

      // Fetch all purchases (admin can see all)
      const { data: purchaseData } = await supabase
        .from("purchases")
        .select("*, matches(home_team, away_team, match_date, stadium)")
        .order("created_at", { ascending: false });
      
      setPurchases(purchaseData || []);

      // Fetch face enrollments
      const { data: enrollmentData } = await supabase
        .from("face_enrollments")
        .select("*");
      
      setFaceEnrollments(enrollmentData || []);
      
      setIsLoading(false);
    };

    fetchData();
  }, [user, isAdmin]);

  // Helper to check if a purchase has face enrollment
  const getFaceEnrollmentStatus = (purchase: PurchaseWithDetails) => {
    const enrollment = faceEnrollments.find(
      (e) => e.user_id === purchase.user_id
    );
    return enrollment;
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Filter profiles by search
  const filteredProfiles = profiles.filter(
    (profile) =>
      (profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter purchases by search
  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.holder_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.holder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.ticket_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = purchases.reduce((sum, p) => sum + p.price, 0);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-display font-bold">Admin Dashboard</p>
                <p className="text-xs text-muted-foreground">Morocco 2030</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2">
            Admin <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Manage users, view ticket purchases, and monitor sales.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{profiles.length}</p>
                <p className="text-sm text-muted-foreground">Registered Users</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{purchases.length}</p>
                <p className="text-sm text-muted-foreground">Tickets Sold</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-morocco-gold/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-morocco-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Revenue (MAD)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">2030</p>
                <p className="text-sm text-muted-foreground">World Cup Year</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="purchases" className="space-y-6">
          <TabsList>
            <TabsTrigger value="purchases">Ticket Purchases</TabsTrigger>
            <TabsTrigger value="users">Registered Users</TabsTrigger>
          </TabsList>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Purchases Tab */}
          <TabsContent value="purchases">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Match</TableHead>
                      <TableHead>Holder</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Seat</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Face ID</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchases.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Ticket size={40} className="opacity-50" />
                            <p>No purchases found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPurchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {purchase.ticket_id}
                            </code>
                          </TableCell>
                          <TableCell>
                            {purchase.matches ? (
                              <div>
                                <p className="font-medium text-sm">
                                  {purchase.matches.home_team} vs {purchase.matches.away_team}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {purchase.matches.stadium}
                                </p>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{purchase.holder_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {purchase.holder_email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                              {purchase.category_name}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            Block {purchase.block}, Row {purchase.row_number}, Seat{" "}
                            {purchase.seat_number}
                          </TableCell>
                          <TableCell className="font-bold">
                            {purchase.price} MAD
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const enrollment = getFaceEnrollmentStatus(purchase);
                              if (!enrollment) {
                                return (
                                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded flex items-center gap-1">
                                    <ScanFace size={12} />
                                    No
                                  </span>
                                );
                              }
                              return (
                                <div className="flex flex-col gap-1">
                                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded flex items-center gap-1">
                                    <ScanFace size={12} />
                                    Yes
                                  </span>
                                  {enrollment.last_verification_result && (
                                    <span className={`text-xs ${enrollment.last_verification_result === 'verified' ? 'text-secondary' : 'text-destructive'}`}>
                                      Last: {enrollment.last_verification_result}
                                    </span>
                                  )}
                                </div>
                              );
                            })()}
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded capitalize">
                              {purchase.payment_status}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(purchase.created_at), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          Full Name
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Mail size={14} />
                          Email
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          Registered
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfiles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Users size={40} className="opacity-50" />
                            <p>No users found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProfiles.map((profile, index) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">
                            {profile.full_name || "N/A"}
                          </TableCell>
                          <TableCell>{profile.email || "N/A"}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(profile.created_at), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
