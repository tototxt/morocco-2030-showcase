import { motion } from "framer-motion";
import { Download, QrCode, Calendar, MapPin, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { Purchase, Match } from "@/types/tickets";
import { Button } from "@/components/ui/button";

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
      className="bg-gradient-morocco rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto"
    >
      {/* Header */}
      <div className="bg-foreground/10 backdrop-blur-sm p-4 text-white text-center border-b border-white/20">
        <h3 className="font-display text-2xl font-bold">FIFA WORLD CUP 2030</h3>
        <p className="text-sm opacity-80">Official Digital Ticket</p>
      </div>

      {/* Match Info */}
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h4 className="font-display text-xl font-bold">{match.home_team}</h4>
          </div>
          <div className="px-4">
            <span className="text-3xl font-bold opacity-50">VS</span>
          </div>
          <div className="text-center flex-1">
            <h4 className="font-display text-xl font-bold">{match.away_team}</h4>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm opacity-80 mb-1">
              <Calendar size={14} />
              <span>Date</span>
            </div>
            <p className="font-semibold">{format(matchDate, "MMM d, yyyy")}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm opacity-80 mb-1">
              <Clock size={14} />
              <span>Time</span>
            </div>
            <p className="font-semibold">{format(matchDate, "HH:mm")} (GMT+1)</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 col-span-2">
            <div className="flex items-center gap-2 text-sm opacity-80 mb-1">
              <MapPin size={14} />
              <span>Venue</span>
            </div>
            <p className="font-semibold">{match.stadium}, {match.city}</p>
          </div>
        </div>

        {/* Dashed separator */}
        <div className="border-t border-dashed border-white/30 my-6 relative">
          <div className="absolute -left-6 -top-3 w-6 h-6 bg-background rounded-full" />
          <div className="absolute -right-6 -top-3 w-6 h-6 bg-background rounded-full" />
        </div>

        {/* Ticket Details */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="opacity-70">Category</span>
            <span className="font-semibold">{purchase.category_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Block</span>
            <span className="font-semibold">{purchase.block}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Row</span>
            <span className="font-semibold">{purchase.row_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Seat</span>
            <span className="font-semibold">{purchase.seat_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Price</span>
            <span className="font-semibold">{purchase.price} MAD</span>
          </div>
        </div>

        {/* Holder Info */}
        <div className="bg-white/10 rounded-lg p-4 mt-6">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} />
            <span className="text-sm opacity-80">Ticket Holder</span>
          </div>
          <p className="font-semibold">{purchase.holder_name}</p>
          <p className="text-sm opacity-70">{purchase.holder_email}</p>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Ticket ID</p>
            <p className="font-mono font-bold text-sm">{purchase.ticket_id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Payment</p>
            <p className="font-semibold text-sm text-secondary capitalize">
              {purchase.payment_status}
            </p>
          </div>
        </div>

        {/* Simulated QR Code */}
        <div className="bg-muted rounded-xl p-4 flex items-center justify-center">
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
                className="bg-foreground h-8"
                style={{ width: `${parseInt(width) * 2}px` }}
              />
            ))}
        </div>

        <Button onClick={handleDownload} variant="outline" className="w-full mt-4">
          <Download size={16} className="mr-2" />
          Download PDF Ticket
        </Button>
      </div>
    </motion.div>
  );
};
