import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";

interface TestModeBannerProps {
  balance?: number;
  currency?: string;
}

export const TestModeBanner = ({ balance, currency = "TEST_MAD" }: TestModeBannerProps) => {
  const formatBalance = (bal: number) => {
    return (bal / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <FlaskConical className="w-5 h-5 text-amber-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-500 text-sm uppercase tracking-wide">
              Test Mode Only
            </span>
            <span className="bg-amber-500 text-amber-950 text-xs font-bold px-2 py-0.5 rounded">
              SANDBOX
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            No real payments are processed. Use test card: 4242 4242 4242 4242
          </p>
        </div>
        {balance !== undefined && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Virtual Balance</p>
            <p className="font-bold text-lg text-amber-500">
              {formatBalance(balance)} <span className="text-xs">{currency.replace("TEST_", "")}</span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
