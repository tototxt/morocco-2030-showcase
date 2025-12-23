import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MatchCard } from "@/components/tickets/MatchCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Match } from "@/types/tickets";
import { toast } from "sonner";

const TicketStore = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAdmin } = useSupabaseAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  // Redirect admins - they can't purchase tickets
  useEffect(() => {
    if (!authLoading && isAdmin) {
      toast.error("Administrators cannot purchase tickets");
      navigate("/admin");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/tickets" } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("match_date", { ascending: true });

      if (error) {
        toast.error("Failed to load matches");
        console.error(error);
      } else {
        setMatches(data || []);
        setFilteredMatches(data || []);
      }
      setIsLoading(false);
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    let filtered = matches;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.home_team.toLowerCase().includes(term) ||
          m.away_team.toLowerCase().includes(term) ||
          m.stadium.toLowerCase().includes(term)
      );
    }

    if (cityFilter !== "all") {
      filtered = filtered.filter((m) => m.city === cityFilter);
    }

    if (stageFilter !== "all") {
      filtered = filtered.filter((m) => m.stage === stageFilter);
    }

    setFilteredMatches(filtered);
  }, [searchTerm, cityFilter, stageFilter, matches]);

  const cities = [...new Set(matches.map((m) => m.city))];
  const stages = [...new Set(matches.map((m) => m.stage))];

  const handleMatchSelect = (match: Match) => {
    navigate(`/tickets/select/${match.id}`);
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
              Ticket Store
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Select your match and secure your seats for FIFA World Cup 2030 in Morocco
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b sticky top-16 bg-background/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search teams, stadiums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Matches Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No matches found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match, index) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onSelect={handleMatchSelect}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TicketStore;
