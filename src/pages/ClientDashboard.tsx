import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  Mail,
  Trophy,
  MapPin,
  Building,
  Ticket,
  ArrowRight,
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";

const ClientDashboard = () => {
  const { user, signOut, isLoading: authLoading } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const quickLinks = [
    { icon: Ticket, label: "Buy Tickets", href: "/tickets", color: "bg-morocco-gold/10 text-morocco-gold" },
    { icon: MapPin, label: "Explore Cities", href: "/cities", color: "bg-primary/10 text-primary" },
    { icon: Building, label: "View Stadiums", href: "/stadiums", color: "bg-secondary/10 text-secondary" },
    { icon: Trophy, label: "About 2030", href: "/about", color: "bg-destructive/10 text-destructive" },
  ];

  if (authLoading) {
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
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-4">
            Welcome, <span className="text-gradient-morocco">{user?.email?.split("@")[0]}</span>!
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
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
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
                    Explore
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ClientDashboard;
