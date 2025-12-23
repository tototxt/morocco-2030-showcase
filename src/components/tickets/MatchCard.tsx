import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Ticket } from "lucide-react";
import { format } from "date-fns";
import { Match } from "@/types/tickets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MatchCardProps {
  match: Match;
  onSelect: (match: Match) => void;
  index: number;
}

export const MatchCard = ({ match, onSelect, index }: MatchCardProps) => {
  const matchDate = new Date(match.match_date);
  const availabilityPercent = Math.round(
    (match.available_seats / match.total_seats) * 100
  );

  const getAvailabilityColor = () => {
    if (availabilityPercent <= 5) return "bg-destructive text-destructive-foreground";
    if (availabilityPercent <= 20) return "bg-orange-500 text-white";
    return "bg-secondary text-secondary-foreground";
  };

  const getAvailabilityText = () => {
    if (availabilityPercent <= 1) return "Almost Sold Out!";
    if (availabilityPercent <= 5) return `Only ${availabilityPercent}% left`;
    if (availabilityPercent <= 20) return "Selling Fast";
    return `${availabilityPercent}% available`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-border"
    >
      {/* Match Header */}
      <div className="bg-gradient-morocco p-4">
        <Badge variant="secondary" className="mb-2 bg-white/20 text-white hover:bg-white/30">
          {match.stage}
        </Badge>
        <div className="flex items-center justify-between text-white">
          <div className="flex-1 text-right">
            <h3 className="font-display text-xl font-bold">{match.home_team}</h3>
          </div>
          <div className="px-4">
            <span className="text-2xl font-bold">VS</span>
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-display text-xl font-bold">{match.away_team}</h3>
          </div>
        </div>
      </div>

      {/* Match Details */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} />
          <span>{format(matchDate, "EEEE, MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={16} />
          <span>{format(matchDate, "HH:mm")} (GMT+1)</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} />
          <span>{match.stadium}, {match.city}</span>
        </div>

        {/* Availability Badge */}
        <div className="flex items-center justify-between pt-2">
          <Badge className={getAvailabilityColor()}>
            {getAvailabilityText()}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {match.available_seats.toLocaleString()} seats left
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="p-4 pt-0">
        <Button
          onClick={() => onSelect(match)}
          className="w-full bg-primary hover:bg-primary/90"
          disabled={match.available_seats === 0}
        >
          <Ticket size={18} className="mr-2" />
          {match.available_seats === 0 ? "Sold Out" : "Select Seats"}
        </Button>
      </div>
    </motion.div>
  );
};
