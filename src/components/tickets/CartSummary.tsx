import { motion } from "framer-motion";
import { Trash2, ShoppingCart } from "lucide-react";
import { CartItem, Match } from "@/types/tickets";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface CartSummaryProps {
  match: Match;
  items: CartItem[];
  onRemove: (seatId: string) => void;
  onCheckout: () => void;
  userTicketCount: number;
  maxTickets: number;
}

export const CartSummary = ({
  match,
  items,
  onRemove,
  onCheckout,
  userTicketCount,
  maxTickets,
}: CartSummaryProps) => {
  const total = items.reduce((sum, item) => sum + item.seat.price, 0);
  const remainingAllowance = maxTickets - userTicketCount;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg sticky top-24">
      <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
        <ShoppingCart size={20} />
        Your Selection
      </h3>

      {/* Match Info */}
      <div className="bg-muted/50 rounded-lg p-3 mb-4">
        <p className="font-semibold">
          {match.home_team} vs {match.away_team}
        </p>
        <p className="text-sm text-muted-foreground">
          {format(new Date(match.match_date), "MMM d, yyyy - HH:mm")}
        </p>
        <p className="text-sm text-muted-foreground">{match.stadium}</p>
      </div>

      {/* Ticket Limit Warning */}
      <div className="bg-primary/10 rounded-lg p-3 mb-4">
        <p className="text-sm">
          <strong>Ticket Limit:</strong> {remainingAllowance} of {maxTickets} remaining
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          You can purchase up to {maxTickets} tickets total across all matches.
        </p>
      </div>

      {/* Selected Seats */}
      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No seats selected</p>
          <p className="text-sm mt-1">Click on available seats to select</p>
        </div>
      ) : (
        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {items.map((item, index) => (
            <motion.div
              key={item.seat.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">
                  Block {item.seat.block}, Row {item.seat.row_number}, Seat{" "}
                  {item.seat.seat_number}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.category.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{item.seat.price} MAD</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(item.seat.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Total & Checkout */}
      {items.length > 0 && (
        <>
          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total</span>
              <span className="text-2xl font-bold text-primary">
                {total.toLocaleString()} MAD
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {items.length} ticket{items.length > 1 ? "s" : ""}
            </p>
          </div>

          <Button
            onClick={onCheckout}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </div>
  );
};
