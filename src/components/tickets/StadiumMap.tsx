import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Seat, TicketCategory } from "@/types/tickets";

interface StadiumMapProps {
  seats: Seat[];
  categories: TicketCategory[];
  selectedCategory?: string | null;
}

export const StadiumMap = ({
  seats,
  categories,
  selectedCategory,
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
      <h4 className="font-semibold text-lg mb-2">Stadium Overview</h4>
      <p className="text-sm text-muted-foreground mb-4">
        Seat availability by section - select a category below to continue
      </p>

      {/* Stadium SVG Visualization - Presentation Only */}
      <div className="relative w-full max-w-2xl mx-auto">
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

          {/* Blocks around the stadium - presentation only, not clickable */}
          {blocks.map((block) => {
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

            const avgColor = blockSeats.length > 0 ? getCategoryColor(blockSeats[0].category_id) : "#22c55e";
            const blockCategoryId = blockSeats.length > 0 ? blockSeats[0].category_id : null;
            const isHighlighted = selectedCategory && blockCategoryId === selectedCategory;
            const isDimmed = selectedCategory && blockCategoryId !== selectedCategory;

            return (
              <g key={block}>
                <motion.rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx="8"
                  fill={avgColor}
                  opacity={isDimmed ? 0.2 : isHighlighted ? 1 : availability > 50 ? 0.7 : availability > 20 ? 0.5 : 0.3}
                  stroke={isHighlighted ? "#fff" : "none"}
                  strokeWidth={isHighlighted ? 2 : 0}
                  animate={{ 
                    opacity: isDimmed ? 0.2 : isHighlighted ? 1 : availability > 50 ? 0.7 : availability > 20 ? 0.5 : 0.3,
                    scale: isHighlighted ? 1.02 : 1
                  }}
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
                      opacity={isDimmed ? 0.3 : 1}
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
                      opacity={isDimmed ? 0.3 : 0.8}
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

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded bg-secondary/50" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded bg-destructive/50" />
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};
