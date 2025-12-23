import { motion } from "framer-motion";
import { Eye, DollarSign } from "lucide-react";
import { Seat, TicketCategory } from "@/types/tickets";

interface StadiumMapProps {
  seats: Seat[];
  categories: TicketCategory[];
  selectedSeats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  maxSelectable: number;
}

export const StadiumMap = ({
  seats,
  categories,
  selectedSeats,
  onSeatSelect,
  maxSelectable,
}: StadiumMapProps) => {
  // Group seats by block for stadium layout
  const blocks = ["A", "B", "C", "D", "E", "F"];
  
  const getSeatsByBlock = (block: string) => {
    return seats.filter((seat) => seat.block === block);
  };

  const getCategoryColor = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.color || "#22c55e";
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || "Standard";
  };

  const isSeatSelected = (seatId: string) => {
    return selectedSeats.some((s) => s.id === seatId);
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "sold") return;
    if (!isSeatSelected(seat.id) && selectedSeats.length >= maxSelectable) return;
    onSeatSelect(seat);
  };

  // Calculate availability percentage for each block
  const getBlockAvailability = (block: string) => {
    const blockSeats = getSeatsByBlock(block);
    if (blockSeats.length === 0) return 100;
    const available = blockSeats.filter((s) => s.status === "available").length;
    return Math.round((available / blockSeats.length) * 100);
  };

  const getLowestPrice = (block: string) => {
    const blockSeats = getSeatsByBlock(block).filter((s) => s.status === "available");
    if (blockSeats.length === 0) return null;
    return Math.min(...blockSeats.map((s) => s.price));
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg">
      {/* Stadium SVG Visualization */}
      <div className="relative w-full max-w-2xl mx-auto mb-8">
        <svg viewBox="0 0 400 300" className="w-full h-auto">
          {/* Field */}
          <rect x="100" y="100" width="200" height="100" rx="10" fill="#22c55e" opacity="0.3" />
          <rect x="110" y="110" width="180" height="80" rx="8" fill="#22c55e" opacity="0.5" />
          {/* Center circle */}
          <circle cx="200" cy="150" r="20" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />
          <circle cx="200" cy="150" r="3" fill="#fff" opacity="0.5" />
          {/* Goal areas */}
          <rect x="110" y="130" width="30" height="40" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />
          <rect x="260" y="130" width="30" height="40" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />

          {/* Blocks around the stadium */}
          {blocks.map((block, index) => {
            const availability = getBlockAvailability(block);
            const lowestPrice = getLowestPrice(block);
            const blockSeats = getSeatsByBlock(block);
            
            // Position blocks around the field
            let x, y, width, height;
            switch (block) {
              case "A": // Top
                x = 100; y = 30; width = 200; height = 50;
                break;
              case "B": // Right
                x = 320; y = 100; width = 50; height = 100;
                break;
              case "C": // Bottom
                x = 100; y = 220; width = 200; height = 50;
                break;
              case "D": // Left
                x = 30; y = 100; width = 50; height = 100;
                break;
              case "E": // Top-right corner
                x = 320; y = 30; width = 50; height = 50;
                break;
              case "F": // Top-left corner
                x = 30; y = 30; width = 50; height = 50;
                break;
              default:
                x = 0; y = 0; width = 50; height = 50;
            }

            const hasSelectedSeats = blockSeats.some((s) => isSeatSelected(s.id));
            const avgColor = blockSeats.length > 0 ? getCategoryColor(blockSeats[0].category_id) : "#22c55e";

            return (
              <g key={block}>
                <motion.rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx="8"
                  fill={avgColor}
                  opacity={availability > 50 ? 0.7 : availability > 20 ? 0.5 : 0.3}
                  stroke={hasSelectedSeats ? "#fbbf24" : "none"}
                  strokeWidth={hasSelectedSeats ? 3 : 0}
                  whileHover={{ opacity: 1, scale: 1.02 }}
                  style={{ cursor: blockSeats.length > 0 ? "pointer" : "default" }}
                />
                {blockSeats.length > 0 && (
                  <>
                    {/* Block label with price */}
                    <text
                      x={x + width / 2}
                      y={y + height / 2 - 8}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {lowestPrice ? `${lowestPrice} MAD` : "SOLD"}
                    </text>
                    {/* Category label */}
                    <text
                      x={x + width / 2}
                      y={y + height / 2 + 8}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="8"
                      opacity="0.8"
                    >
                      {getCategoryName(blockSeats[0].category_id).toUpperCase()}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Availability badge */}
        <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Eye size={12} />
          Only {Math.round((seats.filter(s => s.status === "available").length / Math.max(seats.length, 1)) * 100)}% left
        </div>
      </div>

      {/* Seat Grid */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Select Your Seats</h4>
        <p className="text-sm text-muted-foreground">
          Click on available seats to select (max {maxSelectable})
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {blocks.map((block) => {
            const blockSeats = getSeatsByBlock(block);
            if (blockSeats.length === 0) return null;

            return (
              <div key={block} className="bg-muted/50 rounded-xl p-4">
                <h5 className="font-medium mb-3 flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(blockSeats[0].category_id) }}
                  />
                  Block {block} - {getCategoryName(blockSeats[0].category_id)}
                </h5>
                <div className="grid grid-cols-5 gap-1">
                  {blockSeats.slice(0, 20).map((seat) => (
                    <motion.button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status === "sold"}
                      whileHover={{ scale: seat.status !== "sold" ? 1.2 : 1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-6 h-6 rounded text-[8px] font-bold transition-colors ${
                        seat.status === "sold"
                          ? "bg-destructive/50 text-destructive-foreground cursor-not-allowed"
                          : isSeatSelected(seat.id)
                          ? "bg-morocco-gold text-foreground ring-2 ring-morocco-gold ring-offset-2"
                          : "bg-secondary/20 hover:bg-secondary/40 text-foreground"
                      }`}
                      title={`${seat.row_number}${seat.seat_number} - ${seat.price} MAD`}
                    >
                      {seat.seat_number}
                    </motion.button>
                  ))}
                </div>
                {blockSeats.length > 20 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    +{blockSeats.length - 20} more seats
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded bg-secondary/30" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded bg-morocco-gold" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded bg-destructive/50" />
          <span>Sold</span>
        </div>
      </div>
    </div>
  );
};
