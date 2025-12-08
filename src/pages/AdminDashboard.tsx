import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  Users,
  Search,
  Trash2,
  Info,
  Shield,
  Mail,
  User,
  Lock,
  Calendar,
} from "lucide-react";
import { useAuth, User as UserType } from "@/hooks/useAuth";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  
  const { session, users, logout, clearAllUsers, getSessionData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleClearUsers = () => {
    clearAllUsers();
    toast({
      title: "Users Cleared",
      description: "All client accounts have been removed. Only the master admin remains.",
    });
  };

  const handleShowSession = () => {
    setShowSessionDialog(true);
  };

  // Filter only client users and apply search
  const clientUsers = users.filter(
    (user) =>
      user.role === "client" &&
      (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sessionData = getSessionData();

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
                <span className="text-muted-foreground">{session.email}</span>
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
            Welcome, <span className="text-primary">{session.fullName}</span>
          </h1>
          <p className="text-muted-foreground">
            Manage registered clients and system data from this dashboard.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
                <p className="text-2xl font-bold">{clientUsers.length}</p>
                <p className="text-sm text-muted-foreground">Registered Clients</p>
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
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "admin").length}
                </p>
                <p className="text-sm text-muted-foreground">Admin Accounts</p>
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
                <Calendar className="w-6 h-6 text-morocco-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">2030</p>
                <p className="text-sm text-muted-foreground">World Cup Year</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Client Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="font-display text-xl font-bold">Registered Clients</h2>
              
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Table */}
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
                      <Lock size={14} />
                      Password
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
                {clientUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Users size={40} className="opacity-50" />
                        <p>No clients registered yet</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  clientUsers.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {user.password}
                        </code>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Test Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-muted/50 border border-border rounded-xl"
        >
          <h3 className="font-display text-lg font-bold mb-4">Test Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="destructive"
              onClick={handleClearUsers}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Clear All Users
            </Button>

            <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleShowSession}
                  className="flex items-center gap-2"
                >
                  <Info size={16} />
                  Show Session Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Current Session Data</DialogTitle>
                  <DialogDescription>
                    This shows the authentication session stored in localStorage
                  </DialogDescription>
                </DialogHeader>
                <div className="bg-muted rounded-lg p-4 mt-4">
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(sessionData, null, 2)}
                  </pre>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
