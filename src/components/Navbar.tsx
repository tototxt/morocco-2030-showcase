import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, UserPlus, LogOut, User, Ticket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cities", label: "Cities" },
  { href: "/stadiums", label: "Stadiums" },
  { href: "/tickets", label: "Tickets" },
  { href: "/about", label: "About Morocco 2030" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut, isLoading } = useSupabaseAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDashboard = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/my-tickets");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">M</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-lg leading-tight">Morocco 2030</p>
              <p className="text-xs text-muted-foreground">FIFA World Cup</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "nav-link font-medium",
                  location.pathname === link.href && "active text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoading ? (
              <div className="w-20 h-8 bg-muted rounded animate-pulse" />
            ) : user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDashboard}
                  className="flex items-center gap-2"
                >
                  <User size={16} />
                  {isAdmin ? "Admin" : "My Tickets"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <LogIn size={16} />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                    <UserPlus size={16} />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block py-3 px-4 rounded-lg font-medium transition-colors",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-border mt-4 space-y-2">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleDashboard();
                      }}
                      className="block w-full py-3 px-4 bg-muted text-foreground font-semibold rounded-lg text-center"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <User size={16} />
                        {isAdmin ? "Admin Dashboard" : "My Tickets"}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="block w-full py-3 px-4 bg-destructive/10 text-destructive font-semibold rounded-lg text-center"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <LogOut size={16} />
                        Logout
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full py-3 px-4 bg-muted text-foreground font-semibold rounded-lg text-center"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <LogIn size={16} />
                        Login
                      </span>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg text-center"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <UserPlus size={16} />
                        Sign Up
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
