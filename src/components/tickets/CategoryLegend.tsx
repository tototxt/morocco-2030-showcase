import { motion } from "framer-motion";
import { TicketCategory } from "@/types/tickets";

interface CategoryLegendProps {
  categories: TicketCategory[];
}

export const CategoryLegend = ({ categories }: CategoryLegendProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg">
      <h3 className="font-display text-lg font-bold mb-4">Ticket Categories</h3>
      <div className="space-y-3">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div>
                <p className="font-medium">{category.name}</p>
                {category.description && (
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">
                {category.min_price} - {category.max_price} MAD
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
