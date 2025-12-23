import { motion } from "framer-motion";
import { TicketCategory } from "@/types/tickets";
import { Check } from "lucide-react";

interface CategoryLegendProps {
  categories: TicketCategory[];
  selectedCategory?: string | null;
  onCategorySelect?: (categoryId: string | null) => void;
}

export const CategoryLegend = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategoryLegendProps) => {
  const handleCategoryClick = (categoryId: string) => {
    if (!onCategorySelect) return;
    
    if (selectedCategory === categoryId) {
      onCategorySelect(null); // Deselect if already selected
    } else {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg">
      <h3 className="font-display text-lg font-bold mb-2">Ticket Categories</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Click a category to filter seats, or select directly from the map
      </p>
      <div className="space-y-3">
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(category.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer ${
                isSelected 
                  ? "bg-primary/20 border-2 border-primary shadow-md" 
                  : "bg-muted/50 border-2 border-transparent hover:bg-muted hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: category.color }}
                >
                  {isSelected && <Check size={12} className="text-white" />}
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isSelected ? "text-primary" : ""}`}>
                    {category.name}
                  </p>
                  {category.description && (
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {category.min_price} - {category.max_price} MAD
                </p>
                <p className="text-xs text-muted-foreground">per seat</p>
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {selectedCategory && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onCategorySelect?.(null)}
          className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Clear filter - Show all categories
        </motion.button>
      )}
    </div>
  );
};
