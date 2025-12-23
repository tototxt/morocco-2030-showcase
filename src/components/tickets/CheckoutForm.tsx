import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Building, Smartphone, Ticket } from "lucide-react";
import { CartItem, Match } from "@/types/tickets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";

interface CheckoutFormProps {
  match: Match;
  items: CartItem[];
  holderName: string;
  holderEmail: string;
  onSubmit: (paymentMethod: string) => void;
  isProcessing: boolean;
}

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, MasterCard, Local banks",
  },
  {
    id: "wallet",
    name: "Mobile Wallet",
    icon: Smartphone,
    description: "Apple Pay, Google Pay",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Building,
    description: "CIH, Attijariwafa, BMCE",
  },
  {
    id: "agent",
    name: "Payment Agent",
    icon: Ticket,
    description: "BaridCash, Western Union",
  },
];

export const CheckoutForm = ({
  match,
  items,
  holderName,
  holderEmail,
  onSubmit,
  isProcessing,
}: CheckoutFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const total = items.reduce((sum, item) => sum + item.seat.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(paymentMethod);
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg">
      <h3 className="font-display text-xl font-bold mb-6">Checkout</h3>

      {/* Order Summary */}
      <div className="bg-muted/50 rounded-xl p-4 mb-6">
        <h4 className="font-semibold mb-3">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Match</span>
            <span className="font-medium">
              {match.home_team} vs {match.away_team}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span>{format(new Date(match.match_date), "MMM d, yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Venue</span>
            <span>{match.stadium}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tickets</span>
            <span>{items.length}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            {items.map((item) => (
              <div key={item.seat.id} className="flex justify-between text-xs py-1">
                <span>
                  Block {item.seat.block} - {item.category.name}
                </span>
                <span>{item.seat.price} MAD</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">{total.toLocaleString()} MAD</span>
          </div>
        </div>
      </div>

      {/* Ticket Holder Info */}
      <div className="bg-muted/50 rounded-xl p-4 mb-6">
        <h4 className="font-semibold mb-3">Ticket Holder</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{holderName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{holderEmail}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Payment Method Selection */}
        <div className="mb-6">
          <Label className="mb-3 block">Payment Method</Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="grid grid-cols-2 gap-3"
          >
            {paymentMethods.map((method) => (
              <motion.div key={method.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Label
                  htmlFor={method.id}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                  <method.icon
                    size={24}
                    className={paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}
                  />
                  <span className="font-medium text-sm mt-2">{method.name}</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">
                    {method.description}
                  </span>
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        </div>

        {/* Card Details (shown for card payment) */}
        {paymentMethod === "card" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 mb-6"
          >
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="12/30"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Test card: 4242 4242 4242 4242 | Exp: 12/30 | CVV: 123
            </p>
          </motion.div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
              />
              Processing...
            </>
          ) : (
            `Pay ${total.toLocaleString()} MAD`
          )}
        </Button>
      </form>
    </div>
  );
};
