import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Ticket, Calendar, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DigitalTicket } from "@/components/tickets/DigitalTicket";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Purchase, Match } from "@/types/tickets";
import { toast } from "sonner";
import { format } from "date-fns";

const MyTickets = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useSupabaseAuth();
  const [purchases, setPurchases] = useState<(Purchase & { matches: Match })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<(Purchase & { matches: Match }) | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/my-tickets" } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("purchases")
        .select("*, matches(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load tickets");
        console.error(error);
      } else {
        setPurchases(data || []);
      }
      setIsLoading(false);
    };

    fetchPurchases();
  }, [user]);

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
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-morocco">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              My Tickets
            </h1>
            <p className="text-lg opacity-90">
              View and manage your FIFA World Cup 2030 tickets
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {purchases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                <Ticket className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">No Tickets Yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't purchased any tickets yet. Start by browsing available matches.
              </p>
              <Button onClick={() => navigate("/tickets")} size="lg">
                Browse Matches
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ticket List */}
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold mb-4">
                  Your Tickets ({purchases.length})
                </h2>
                {purchases.map((purchase, index) => (
                  <motion.div
                    key={purchase.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedTicket(purchase)}
                    className={`bg-card rounded-xl p-4 shadow-lg cursor-pointer transition-all hover:shadow-xl border-2 ${
                      selectedTicket?.id === purchase.id
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">
                          {purchase.matches.home_team} vs {purchase.matches.away_team}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar size={14} />
                          <span>
                            {format(new Date(purchase.matches.match_date), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={14} />
                          <span>{purchase.matches.stadium}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded">
                          {purchase.category_name}
                        </span>
                        <p className="text-sm mt-1">
                          Block {purchase.block}, Row {purchase.row_number}, Seat{" "}
                          {purchase.seat_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <span className="text-xs text-muted-foreground font-mono">
                        {purchase.ticket_id}
                      </span>
                      <span className="font-bold text-primary">
                        {purchase.price} MAD
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Ticket Preview */}
              <div className="lg:sticky lg:top-24">
                {selectedTicket ? (
                  <DigitalTicket
                    purchase={selectedTicket}
                    match={selectedTicket.matches}
                  />
                ) : (
                  <div className="bg-muted/50 rounded-2xl p-8 text-center">
                    <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select a ticket to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyTickets;
