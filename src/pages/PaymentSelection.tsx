import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Building, Smartphone, Ticket, ChevronRight, Shield } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Match, CartItem, Purchase } from "@/types/tickets";
import { toast } from "sonner";
import { format } from "date-fns";

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, MasterCard, Local banks",
    popular: true,
  },
  {
    id: "wallet",
    name: "Mobile Wallet",
    icon: Smartphone,
    description: "Apple Pay, Google Pay",
    popular: false,
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Building,
    description: "CIH, Attijariwafa, BMCE",
    popular: false,
  },
  {
    id: "agent",
    name: "Payment Agent",
    icon: Ticket,
    description: "BaridCash, Western Union",
    popular: false,
  },
];

const PaymentSelection = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useSupabaseAuth();

  const [cartData, setCartData] = useState<{ match: Match; items: CartItem[] } | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userProfile, setUserProfile] = useState<{ full_name: string; email: string } | null>(null);

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/tickets/payment" } });
      return;
    }

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

  const handlePayment = async () => {
    if (!selectedMethod || !cartData || !user || !userProfile) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

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
        payment_method: selectedMethod,
        payment_status: "completed",
      }));

      // Insert purchases
      const { error: purchaseError } = await supabase
        .from("purchases")
        .insert(purchasesToCreate);

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

      sessionStorage.removeItem("ticketCart");
      toast.success("Payment successful!");
      navigate("/tickets/confirmation");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const total = cartData?.items.reduce((sum, item) => sum + item.seat.price, 0) || 0;

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
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Review
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-center"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Select Payment Method
            </h1>
            <p className="opacity-90">
              Choose how you'd like to pay for your tickets
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Left: Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <h3 className="font-display text-lg font-bold mb-6">Payment Method</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        selectedMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {method.popular && (
                        <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          selectedMethod === method.id
                            ? "bg-primary/20"
                            : "bg-muted"
                        }`}
                      >
                        <method.icon
                          size={24}
                          className={
                            selectedMethod === method.id
                              ? "text-primary"
                              : "text-muted-foreground"
                          }
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{method.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                      {selectedMethod === method.id && (
                        <ChevronRight className="ml-auto text-primary" size={20} />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Card Details Form */}
              {selectedMethod === "card" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="font-display text-lg font-bold mb-6">Card Details</h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="12/30"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Shield size={12} />
                      Test card: 4242 4242 4242 4242 | Exp: 12/30 | CVV: 123
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="bg-card rounded-2xl p-6 shadow-lg sticky top-24">
                <h3 className="font-display text-lg font-bold mb-4">Order Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Match</span>
                    <span className="font-medium text-right">
                      {cartData.match.home_team} vs {cartData.match.away_team}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>{format(new Date(cartData.match.match_date), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tickets</span>
                    <span>{cartData.items.length}</span>
                  </div>

                  <div className="border-t pt-3 space-y-1">
                    {cartData.items.map((item) => (
                      <div key={item.seat.id} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Block {item.seat.block} - {item.category.name}
                        </span>
                        <span>{item.seat.price} MAD</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="text-primary">{total.toLocaleString()} MAD</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={!selectedMethod || isProcessing}
                  className="w-full mt-6 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                      />
                      Processing...
                    </>
                  ) : (
                    `Pay ${total.toLocaleString()} MAD`
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
                  <Shield size={12} />
                  Secured by SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentSelection;
