import { motion } from "framer-motion";
import { Download, QrCode, Calendar, MapPin, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { Purchase, Match } from "@/types/tickets";
import { Button } from "@/components/ui/button";
import worldcupTicketBg from "@/assets/worldcup-ticket-bg.jpg";

interface DigitalTicketProps {
  purchase: Purchase;
  match: Match;
}

export const DigitalTicket = ({ purchase, match }: DigitalTicketProps) => {
  const matchDate = new Date(match.match_date);

  // Generate a simple barcode pattern
  const generateBarcode = () => {
    const pattern = purchase.ticket_id
      .split("")
      .map((char) => (char.charCodeAt(0) % 2 === 0 ? "2" : "1"))
      .join("");
    return pattern;
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert("In production, this would download a PDF ticket with a valid QR code.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto relative"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${worldcupTicketBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Header */}
      <div className="relative bg-black/40 backdrop-blur-sm p-5 text-white text-center border-b border-amber-400/40">
        <h3 className="font-display text-2xl font-bold tracking-wider text-amber-100 drop-shadow-lg">
          FIFA WORLD CUP 2030
        </h3>
        <p className="text-sm text-amber-200/90 font-medium tracking-wide">Official Digital Ticket</p>
      </div>

      {/* Match Info */}
      <div className="relative p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h4 className="font-display text-2xl font-bold text-white drop-shadow-lg tracking-wide">
              {match.home_team}
            </h4>
          </div>
          <div className="px-4">
            <span className="text-4xl font-black text-amber-400 drop-shadow-lg">VS</span>
          </div>
          <div className="text-center flex-1">
            <h4 className="font-display text-2xl font-bold text-white drop-shadow-lg tracking-wide">
              {match.away_team}
            </h4>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-amber-400/30">
            <div className="flex items-center gap-2 text-sm text-amber-300 mb-1">
              <Calendar size={14} />
              <span className="font-medium">Date</span>
            </div>
            <p className="font-bold text-white text-lg drop-shadow-md">{format(matchDate, "MMM d, yyyy")}</p>
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-amber-400/30">
            <div className="flex items-center gap-2 text-sm text-amber-300 mb-1">
              <Clock size={14} />
              <span className="font-medium">Time</span>
            </div>
            <p className="font-bold text-white text-lg drop-shadow-md">{format(matchDate, "HH:mm")} (GMT+1)</p>
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 col-span-2 border border-amber-400/30">
            <div className="flex items-center gap-2 text-sm text-amber-300 mb-1">
              <MapPin size={14} />
              <span className="font-medium">Venue</span>
            </div>
            <p className="font-bold text-white text-lg drop-shadow-md">{match.stadium}, {match.city}</p>
          </div>
        </div>

        {/* Dashed separator */}
        <div className="border-t-2 border-dashed border-amber-400/50 my-6 relative">
          <div className="absolute -left-6 -top-3 w-6 h-6 bg-background rounded-full" />
          <div className="absolute -right-6 -top-3 w-6 h-6 bg-background rounded-full" />
        </div>

        {/* Ticket Details */}
        <div className="space-y-3 bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-amber-400/30">
          <div className="flex justify-between items-center">
            <span className="text-amber-300 font-medium">Category</span>
            <span className="font-bold text-white text-lg">{purchase.category_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-amber-300 font-medium">Block</span>
            <span className="font-bold text-white text-lg">{purchase.block}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-amber-300 font-medium">Row</span>
            <span className="font-bold text-white text-lg">{purchase.row_number}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-amber-300 font-medium">Seat</span>
            <span className="font-bold text-white text-lg">{purchase.seat_number}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-amber-400/30">
            <span className="text-amber-300 font-medium">Price</span>
            <span className="font-bold text-amber-400 text-xl">{purchase.price} MAD</span>
          </div>
        </div>

        {/* Holder Info */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 mt-6 border border-amber-400/30">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-amber-400" />
            <span className="text-sm text-amber-300 font-medium">Ticket Holder</span>
          </div>
          <p className="font-bold text-white text-lg">{purchase.holder_name}</p>
          <p className="text-amber-200/80">{purchase.holder_email}</p>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="relative bg-white/95 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Ticket ID</p>
            <p className="font-mono font-bold text-sm text-foreground">{purchase.ticket_id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-medium">Payment</p>
            <p className="font-bold text-sm text-green-600 capitalize">
              {purchase.payment_status}
            </p>
          </div>
        </div>

        {/* Simulated QR Code */}
        <div className="bg-white rounded-xl p-4 flex items-center justify-center border-2 border-gray-200">
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${
                  Math.random() > 0.5 ? "bg-foreground" : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Barcode */}
        <div className="mt-4 flex justify-center gap-0.5">
          {generateBarcode()
            .split("")
            .map((width, i) => (
              <div
                key={i}
                className="bg-foreground h-10"
                style={{ width: `${parseInt(width) * 2}px` }}
              />
            ))}
        </div>

        <Button onClick={handleDownload} variant="outline" className="w-full mt-4 font-semibold">
          <Download size={16} className="mr-2" />
          Download PDF Ticket
        </Button>
      </div>
    </motion.div>
  );
};
