import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StadiumMap } from "@/components/tickets/StadiumMap";
import { CategoryLegend } from "@/components/tickets/CategoryLegend";
import { MatchHeader } from "@/components/tickets/MatchHeader";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Match, TicketCategory, Seat } from "@/types/tickets";
import { toast } from "sonner";

const MAX_TICKETS_PER_USER = 4;

const SeatSelection = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAdmin } = useSupabaseAuth();

  const [match, setMatch] = useState<Match | null>(null);
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [userTicketCount, setUserTicketCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Redirect admins - they can't purchase tickets
  useEffect(() => {
    if (!authLoading && isAdmin) {
      toast.error("Administrators cannot purchase tickets");
      navigate("/admin");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: `/tickets/select/${matchId}` } });
    }
  }, [user, authLoading, navigate, matchId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!matchId || !user || isAdmin) return;

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
  }, [matchId, user, navigate, isAdmin]);

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

  const handleContinue = () => {
    if (!selectedCategory) {
      toast.error("Please select a ticket category first");
      return;
    }

    // Get an available seat from the selected category
    const categorySeats = seats.filter(
      (s) => s.category_id === selectedCategory && s.status === "available"
    );
    
    if (categorySeats.length === 0) {
      toast.error("No available seats in this category");
      return;
    }

    // Auto-select a seat from the category
    const selectedSeat = categorySeats[0];
    const category = categories.find((c) => c.id === selectedCategory);
    
    if (!category) {
      toast.error("Category not found");
      return;
    }

    // Store cart in sessionStorage for review page
    sessionStorage.setItem("ticketCart", JSON.stringify({
      match,
      items: [{ seat: selectedSeat, category }],
    }));

    navigate("/tickets/review");
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
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

      {/* Match Header with Stadium Background */}
      <MatchHeader match={match} />

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Stadium Map - Presentation Only */}
            <div>
              <StadiumMap
                seats={seats}
                categories={categories}
                selectedCategory={selectedCategory}
              />
            </div>
            
            {/* Category Selection */}
            <div>
              <CategoryLegend 
                categories={categories} 
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                onContinue={handleContinue}
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
