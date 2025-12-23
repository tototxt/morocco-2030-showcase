import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StadiumMap } from "@/components/tickets/StadiumMap";
import { CategoryLegend } from "@/components/tickets/CategoryLegend";
import { CartSummary } from "@/components/tickets/CartSummary";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Match, TicketCategory, Seat, CartItem } from "@/types/tickets";
import { toast } from "sonner";
import { format } from "date-fns";

const MAX_TICKETS_PER_USER = 4;

const SeatSelection = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useSupabaseAuth();

  const [match, setMatch] = useState<Match | null>(null);
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userTicketCount, setUserTicketCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: `/tickets/select/${matchId}` } });
    }
  }, [user, authLoading, navigate, matchId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!matchId || !user) return;

      // Fetch match
      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .maybeSingle();

      if (matchError || !matchData) {
        toast.error("Match not found");
        navigate("/tickets");
        return;
      }

      setMatch(matchData);

      // Fetch categories
      const { data: catData } = await supabase
        .from("ticket_categories")
        .select("*");
      setCategories(catData || []);

      // Fetch seats for this match
      const { data: seatData } = await supabase
        .from("seats")
        .select("*, ticket_categories(*)")
        .eq("match_id", matchId);
      
      // If no seats exist, generate sample seats
      if (!seatData || seatData.length === 0) {
        await generateSampleSeats(matchId, catData || []);
        // Refetch seats
        const { data: newSeatData } = await supabase
          .from("seats")
          .select("*, ticket_categories(*)")
          .eq("match_id", matchId);
        setSeats(newSeatData || []);
      } else {
        setSeats(seatData);
      }

      // Fetch user's ticket count
      const { data: purchaseData } = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", user.id);
      setUserTicketCount(purchaseData?.length || 0);

      setIsLoading(false);
    };

    fetchData();
  }, [matchId, user, navigate]);

  const generateSampleSeats = async (matchId: string, categories: TicketCategory[]) => {
    if (categories.length === 0) return;

    const blocks = ["A", "B", "C", "D", "E", "F"];
    const seatsToInsert: any[] = [];

    blocks.forEach((block, blockIndex) => {
      const category = categories[blockIndex % categories.length];
      const rows = ["1", "2", "3", "4"];
      
      rows.forEach((row) => {
        for (let seatNum = 1; seatNum <= 5; seatNum++) {
          // Random status with 80% available, 20% sold
          const status = Math.random() > 0.2 ? "available" : "sold";
          const price = category.min_price + 
            Math.floor(Math.random() * (category.max_price - category.min_price));

          seatsToInsert.push({
            match_id: matchId,
            category_id: category.id,
            block,
            row_number: row,
            seat_number: seatNum.toString(),
            price,
            status,
          });
        }
      });
    });

    await supabase.from("seats").insert(seatsToInsert);
  };

  const handleSeatSelect = (seat: Seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    const remainingAllowance = MAX_TICKETS_PER_USER - userTicketCount;

    if (isSelected) {
      // Deselect
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
      setCartItems(cartItems.filter((item) => item.seat.id !== seat.id));
    } else {
      // Check limit
      if (selectedSeats.length >= remainingAllowance) {
        toast.error(`You can only purchase ${remainingAllowance} more ticket(s)`);
        return;
      }

      const category = categories.find((c) => c.id === seat.category_id);
      if (category) {
        setSelectedSeats([...selectedSeats, seat]);
        setCartItems([...cartItems, { seat, category }]);
      }
    }
  };

  const handleRemoveFromCart = (seatId: string) => {
    setSelectedSeats(selectedSeats.filter((s) => s.id !== seatId));
    setCartItems(cartItems.filter((item) => item.seat.id !== seatId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    // Store cart in sessionStorage for checkout page
    sessionStorage.setItem("ticketCart", JSON.stringify({
      match,
      items: cartItems,
    }));

    navigate("/tickets/checkout");
  };

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

  if (!match) {
    return null;
  }

  const remainingAllowance = MAX_TICKETS_PER_USER - userTicketCount;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-morocco">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/tickets")}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Matches
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <div className="flex items-center gap-4 mb-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {match.stage}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {match.home_team} vs {match.away_team}
            </h1>
            <p className="opacity-90">
              {format(new Date(match.match_date), "EEEE, MMMM d, yyyy 'at' HH:mm")} • {match.stadium}, {match.city}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ticket Limit Warning */}
      {remainingAllowance < MAX_TICKETS_PER_USER && (
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-primary">
              <AlertTriangle size={18} />
              <span>
                You have purchased {userTicketCount} ticket(s). You can buy {remainingAllowance} more.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stadium Map & Categories */}
            <div className="lg:col-span-2 space-y-6">
              <StadiumMap
                seats={seats}
                categories={categories}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
                maxSelectable={remainingAllowance}
              />
              <CategoryLegend categories={categories} />
            </div>

            {/* Cart Sidebar */}
            <div>
              <CartSummary
                match={match}
                items={cartItems}
                onRemove={handleRemoveFromCart}
                onCheckout={handleCheckout}
                userTicketCount={userTicketCount}
                maxTickets={MAX_TICKETS_PER_USER}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SeatSelection;
