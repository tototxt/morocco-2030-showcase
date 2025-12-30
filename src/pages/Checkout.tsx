import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckoutForm } from "@/components/tickets/CheckoutForm";
import { DigitalTicket } from "@/components/tickets/DigitalTicket";
import { TestModeBanner } from "@/components/tickets/TestModeBanner";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useVirtualCard } from "@/hooks/useVirtualCard";
import { supabase } from "@/integrations/supabase/client";
import { Match, CartItem, Purchase } from "@/types/tickets";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useSupabaseAuth();
  const { card, processPayment, formatBalance } = useVirtualCard(user?.id);

  const [cartData, setCartData] = useState<{ match: Match; items: CartItem[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [userProfile, setUserProfile] = useState<{ full_name: string; email: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/tickets/checkout" } });
      return;
    }

    // Load cart from session storage
    const savedCart = sessionStorage.getItem("ticketCart");
    if (!savedCart) {
      toast.error("No tickets in cart");
      navigate("/tickets");
      return;
    }

    setCartData(JSON.parse(savedCart));
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setUserProfile({
          full_name: data.full_name || user.email?.split("@")[0] || "Guest",
          email: data.email || user.email || "",
        });
      } else {
        setUserProfile({
          full_name: user.email?.split("@")[0] || "Guest",
          email: user.email || "",
        });
      }
    };

    fetchProfile();
  }, [user]);

  const generateTicketId = () => {
    const prefix = "WC2030";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSubmit = async (paymentMethod: string, cardDetails?: { cardNumber: string; expiry: string; cvv: string }) => {
    if (!cartData || !user || !userProfile) return;

    setIsProcessing(true);
    const total = cartData.items.reduce((sum, item) => sum + item.seat.price, 0);
    const totalInCents = total * 100; // Convert to cents for virtual card

    try {
      // Process virtual payment if card method
      if (paymentMethod === "card" && cardDetails) {
        const ticketReference = `WC2030-${Date.now().toString(36).toUpperCase()}`;
        const paymentResult = await processPayment(
          cardDetails.cardNumber,
          cardDetails.expiry,
          cardDetails.cvv,
          totalInCents,
          ticketReference,
          `Ticket purchase: ${cartData.match.home_team} vs ${cartData.match.away_team}`
        );

        if (!paymentResult.success) {
          if (paymentResult.error === "Insufficient balance") {
            toast.error(`Insufficient balance. Available: ${formatBalance(paymentResult.available_balance || 0)} MAD, Required: ${formatBalance(paymentResult.required_amount || 0)} MAD`);
          } else {
            toast.error(paymentResult.error || "Payment failed");
          }
          setIsProcessing(false);
          return;
        }

        toast.success(`Payment successful! New balance: ${formatBalance(paymentResult.balance_after || 0)} MAD`);
      } else {
        // Simulate other payment methods
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const purchasesToCreate = cartData.items.map((item) => ({
        user_id: user.id,
        match_id: cartData.match.id,
        seat_id: item.seat.id,
        ticket_id: generateTicketId(),
        category_name: item.category.name,
        block: item.seat.block,
        row_number: item.seat.row_number,
        seat_number: item.seat.seat_number,
        price: item.seat.price,
        holder_name: userProfile.full_name,
        holder_email: userProfile.email,
        payment_method: paymentMethod,
        payment_status: "completed",
      }));

      // Insert purchases
      const { data: insertedPurchases, error: purchaseError } = await supabase
        .from("purchases")
        .insert(purchasesToCreate)
        .select();

      if (purchaseError) throw purchaseError;

      // Update seat status to sold
      const seatIds = cartData.items.map((item) => item.seat.id);
      await supabase
        .from("seats")
        .update({ status: "sold" })
        .in("id", seatIds);

      // Update match available seats
      const newAvailable = cartData.match.available_seats - cartData.items.length;
      await supabase
        .from("matches")
        .update({ available_seats: Math.max(0, newAvailable) })
        .eq("id", cartData.match.id);

      setPurchases(insertedPurchases || []);
      setPurchaseComplete(true);
      sessionStorage.removeItem("ticketCart");
      toast.success("Purchase complete! Your tickets are ready.");
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to complete purchase. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || !cartData || !userProfile) {
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
          {!purchaseComplete && (
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Seat Selection
            </Button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-center"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {purchaseComplete ? "Purchase Complete!" : "Checkout"}
            </h1>
            <p className="opacity-90">
              {purchaseComplete
                ? "Your tickets have been confirmed"
                : "Complete your ticket purchase"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {purchaseComplete ? (
            <div className="space-y-8">
              {/* Test Mode Banner */}
              <TestModeBanner balance={card?.balance} currency={card?.currency} />

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  Thank You for Your Purchase!
                </h2>
                <p className="text-muted-foreground">
                  A confirmation email has been sent to {userProfile.email}
                </p>
              </motion.div>

              {/* Digital Tickets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {purchases.map((purchase) => (
                  <DigitalTicket
                    key={purchase.id}
                    purchase={purchase}
                    match={cartData.match}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button onClick={() => navigate("/my-tickets")} size="lg">
                  View All My Tickets
                </Button>
                <Button
                  onClick={() => navigate("/tickets")}
                  variant="outline"
                  size="lg"
                >
                  Buy More Tickets
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {/* Test Mode Banner */}
              <TestModeBanner balance={card?.balance} currency={card?.currency} />

              <CheckoutForm
                match={cartData.match}
                items={cartData.items}
                holderName={userProfile.full_name}
                holderEmail={userProfile.email}
                onSubmit={handleSubmit}
                isProcessing={isProcessing}
                virtualCardBalance={card?.balance}
              />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
