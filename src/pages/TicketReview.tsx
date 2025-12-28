import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MiniStadiumMap } from "@/components/tickets/MiniStadiumMap";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Match, CartItem } from "@/types/tickets";
import { toast } from "sonner";
import { format } from "date-fns";

const TicketReview = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useSupabaseAuth();

  const [cartData, setCartData] = useState<{ match: Match; items: CartItem[] } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/tickets/review" } });
      return;
    }

    const savedCart = sessionStorage.getItem("ticketCart");
    if (!savedCart) {
      toast.error("No tickets selected");
      navigate("/tickets");
      return;
    }

    setCartData(JSON.parse(savedCart));
  }, [user, authLoading, navigate]);

  const handleRemoveItem = (seatId: string) => {
    if (!cartData) return;

    const updatedItems = cartData.items.filter((item) => item.seat.id !== seatId);
    
    if (updatedItems.length === 0) {
      sessionStorage.removeItem("ticketCart");
      toast.info("Cart is empty, returning to selection");
      navigate(`/tickets/select/${cartData.match.id}`);
      return;
    }

    const updatedCart = { ...cartData, items: updatedItems };
    setCartData(updatedCart);
    sessionStorage.setItem("ticketCart", JSON.stringify(updatedCart));
    toast.success("Ticket removed");
  };

  const handleAddMore = () => {
    if (cartData) {
      navigate(`/tickets/select/${cartData.match.id}`);
    }
  };

  const handleContinue = () => {
    navigate("/tickets/payment");
  };

  const total = cartData?.items.reduce((sum, item) => sum + item.seat.price, 0) || 0;
  const uniqueBlocks = [...new Set(cartData?.items.map((item) => item.seat.block) || [])];
  const categoryColor = cartData?.items[0]?.category.color || "#22c55e";

  if (authLoading || !cartData) {
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
            Back to Seat Selection
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-center"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Review Your Tickets
            </h1>
            <p className="opacity-90">
              Review your selection before proceeding to payment
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Left: Ticket Details */}
            <div className="space-y-6">
              {/* Match Info */}
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <h3 className="font-display text-lg font-bold mb-4">Match Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Match</span>
                    <span className="font-bold text-primary">
                      {cartData.match.home_team} vs {cartData.match.away_team}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>{format(new Date(cartData.match.match_date), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span>{format(new Date(cartData.match.match_date), "h:mm a")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venue</span>
                    <span>{cartData.match.stadium}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">City</span>
                    <span>{cartData.match.city}</span>
                  </div>
                </div>
              </div>

              {/* Selected Tickets */}
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold">Selected Tickets ({cartData.items.length})</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddMore}
                    className="text-sm"
                  >
                    <Plus size={16} className="mr-1" />
                    Add More
                  </Button>
                </div>

                <div className="space-y-3">
                  {cartData.items.map((item, index) => (
                    <motion.div
                      key={item.seat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.category.color }}
                        />
                        <div>
                          <p className="font-semibold">
                            Block {item.seat.block} - Row {item.seat.row_number} - Seat {item.seat.seat_number}
                          </p>
                          <p className="text-sm text-muted-foreground">{item.category.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">{item.seat.price} MAD</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.seat.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Stadium Map & Summary */}
            <div className="space-y-6">
              {/* Mini Stadium Map */}
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <h3 className="font-display text-lg font-bold mb-4 text-center">Your Seat Location</h3>
                <MiniStadiumMap 
                  selectedBlocks={uniqueBlocks} 
                  highlightColor={categoryColor}
                />
              </div>

              {/* Order Summary */}
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <h3 className="font-display text-lg font-bold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tickets ({cartData.items.length})</span>
                    <span>{total.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="text-secondary">FREE</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="text-primary">{total.toLocaleString()} MAD</span>
                  </div>
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full mt-6 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Continue to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TicketReview;
