import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Download, Mail, Ticket } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { DigitalTicket } from "@/components/tickets/DigitalTicket";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Match, Purchase } from "@/types/tickets";
import { toast } from "sonner";

const PurchaseConfirmation = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useSupabaseAuth();

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    const fetchLatestPurchases = async () => {
      if (!user) return;

      // Fetch the most recent purchases (within last minute)
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
      
      const { data: purchaseData, error } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", oneMinuteAgo)
        .order("created_at", { ascending: false });

      if (error || !purchaseData || purchaseData.length === 0) {
        // If no recent purchases, go to my tickets
        navigate("/my-tickets");
        return;
      }

      setPurchases(purchaseData);

      // Fetch match details
      const matchId = purchaseData[0].match_id;
      const { data: matchData } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .maybeSingle();

      if (matchData) {
        setMatch(matchData);
      }

      setIsLoading(false);
    };

    fetchLatestPurchases();
  }, [user, authLoading, navigate]);

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

      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-morocco">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Purchase Complete!
            </h1>
            <p className="opacity-90">
              Your tickets have been confirmed and are ready
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Confirmation Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full mb-4">
              <Mail size={16} />
              <span className="text-sm">
                Confirmation email sent to {purchases[0]?.holder_email}
              </span>
            </div>
            <p className="text-muted-foreground max-w-lg mx-auto">
              You can access your tickets anytime from the "My Tickets" section.
              Present the QR code at the stadium entrance for validation.
            </p>
          </motion.div>

          {/* Digital Tickets */}
          {match && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">
              {purchases.map((purchase, index) => (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <DigitalTicket purchase={purchase} match={match} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate("/my-tickets")}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Ticket size={20} className="mr-2" />
              View All My Tickets
            </Button>
            <Button
              onClick={() => navigate("/tickets")}
              variant="outline"
              size="lg"
            >
              Buy More Tickets
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <div className="bg-card rounded-2xl p-6 shadow-lg">
              <h3 className="font-display text-lg font-bold mb-4">
                Important Information
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Please arrive at the stadium at least 2 hours before the match
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Bring a valid ID matching the ticket holder's name
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Your ticket includes a QR code for fast stadium entry
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Tickets are non-transferable and linked to your account
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PurchaseConfirmation;
