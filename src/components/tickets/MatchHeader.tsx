import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Match } from "@/types/tickets";
import { format } from "date-fns";
import { cities } from "@/data/cities";

interface MatchHeaderProps {
  match: Match;
}

export const MatchHeader = ({ match }: MatchHeaderProps) => {
  const navigate = useNavigate();
  
  // Find the city's stadium image
  const city = cities.find(
    (c) => c.name.toLowerCase() === match.city.toLowerCase()
  );
  const stadiumImage = city?.stadium?.image;

  return (
    <section className="relative pt-24 pb-12 overflow-hidden">
      {/* Stadium Background Image */}
      {stadiumImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={stadiumImage}
            alt={`${match.stadium} stadium`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>
      )}
      
      {/* Fallback gradient if no image */}
      {!stadiumImage && (
        <div className="absolute inset-0 z-0 bg-gradient-morocco" />
      )}

      <div className="container mx-auto px-4 relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/tickets")}
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Matches
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          {/* Stage Badge */}
          <div className="mb-4">
            <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
              {match.stage}
            </span>
          </div>

          {/* Match Title - More visible */}
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-white/10">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              <span className="text-morocco-red">{match.home_team}</span>
              <span className="text-white/80 mx-4">vs</span>
              <span className="text-morocco-green">{match.away_team}</span>
            </h1>
          </div>

          {/* Match Details */}
          <div className="flex flex-wrap gap-4 text-white/90">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Calendar size={18} className="text-morocco-gold" />
              <span className="font-medium">
                {format(new Date(match.match_date), "EEEE, MMMM d, yyyy 'at' HH:mm")}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <MapPin size={18} className="text-morocco-gold" />
              <span className="font-medium">{match.stadium}, {match.city}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
