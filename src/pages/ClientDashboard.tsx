import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  Mail,
  Trophy,
  MapPin,
  Building,
  Trash2,
  Info,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const ClientDashboard = () => {
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  
  const { session, logout, clearAllUsers, getSessionData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleClearUsers = () => {
    clearAllUsers();
    toast({
      title: "Users Cleared",
      description: "All user data has been reset.",
    });
  };

  const sessionData = getSessionData();

  const quickLinks = [
    { icon: MapPin, label: "Explore Cities", href: "/cities", color: "bg-primary/10 text-primary" },
    { icon: Building, label: "View Stadiums", href: "/stadiums", color: "bg-secondary/10 text-secondary" },
    { icon: Trophy, label: "About 2030", href: "/about", color: "bg-morocco-gold/10 text-morocco-gold" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">M</span>
              </div>
              <div>
                <p className="font-display font-bold">Morocco 2030</p>
                <p className="text-xs text-muted-foreground">FIFA World Cup</p>
              </div>
            </Link>

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
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-4">
            Welcome, <span className="text-gradient-morocco">{session.fullName}</span>!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You're now part of the Morocco 2030 World Cup community. Explore the host cities, 
            discover amazing stadiums, and get ready for the greatest football event in history.
          </p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto bg-card border border-border rounded-2xl p-6 mb-12"
        >
          <h2 className="font-display text-xl font-bold mb-4">Your Account</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-medium">{session.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{session.email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="font-display text-2xl font-bold text-center mb-8">
            Explore Morocco 2030
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link
                  to={link.href}
                  className="block bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className={`w-14 h-14 ${link.color} rounded-xl flex items-center justify-center mb-4`}>
                    <link.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{link.label}</h3>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                    Discover
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Test Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-md mx-auto p-6 bg-muted/50 border border-border rounded-xl"
        >
          <h3 className="font-display text-lg font-bold mb-4">Test Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="destructive"
              size="sm"
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
                  size="sm"
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

export default ClientDashboard;
