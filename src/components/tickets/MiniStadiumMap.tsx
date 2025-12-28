import { motion } from "framer-motion";

interface MiniStadiumMapProps {
  selectedBlocks?: string[];
  highlightColor?: string;
}

export const MiniStadiumMap = ({ 
  selectedBlocks = [], 
  highlightColor = "#22c55e" 
}: MiniStadiumMapProps) => {
  const blocks = [
    { id: "A", x: 40, y: 10, width: 80, height: 20, label: "North Stand" },
    { id: "B", x: 130, y: 40, width: 20, height: 40, label: "East" },
    { id: "C", x: 40, y: 90, width: 80, height: 20, label: "South Stand" },
    { id: "D", x: 10, y: 40, width: 20, height: 40, label: "West" },
    { id: "E", x: 130, y: 10, width: 20, height: 20, label: "NE" },
    { id: "F", x: 10, y: 10, width: 20, height: 20, label: "NW" },
  ];

  return (
    <div className="w-full max-w-[200px] mx-auto">
      <svg viewBox="0 0 160 120" className="w-full h-auto">
        {/* Stadium outline */}
        <rect
          x="5"
          y="5"
          width="150"
          height="110"
          rx="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* Field */}
        <rect x="40" y="35" width="80" height="50" rx="4" fill="#22c55e" opacity="0.2" />
        <rect x="45" y="40" width="70" height="40" rx="2" fill="#22c55e" opacity="0.3" />
        
        {/* Center circle */}
        <circle cx="80" cy="60" r="8" fill="none" stroke="#fff" strokeWidth="1" opacity="0.3" />
        
        {/* Goal areas */}
        <rect x="45" y="50" width="10" height="20" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
        <rect x="105" y="50" width="10" height="20" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.3" />

        {/* Blocks */}
        {blocks.map((block) => {
          const isHighlighted = selectedBlocks.includes(block.id);
          
          return (
            <motion.g key={block.id}>
              <motion.rect
                x={block.x}
                y={block.y}
                width={block.width}
                height={block.height}
                rx="3"
                fill={isHighlighted ? highlightColor : "#64748b"}
                opacity={isHighlighted ? 0.9 : 0.3}
                animate={{
                  opacity: isHighlighted ? [0.7, 0.9, 0.7] : 0.3,
                  scale: isHighlighted ? [1, 1.02, 1] : 1,
                }}
                transition={{
                  duration: 1.5,
                  repeat: isHighlighted ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />
              {isHighlighted && (
                <motion.rect
                  x={block.x}
                  y={block.y}
                  width={block.width}
                  height={block.height}
                  rx="3"
                  fill="none"
                  stroke={highlightColor}
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.g>
          );
        })}

        {/* Block labels */}
        {blocks.map((block) => {
          const isHighlighted = selectedBlocks.includes(block.id);
          return (
            <text
              key={`label-${block.id}`}
              x={block.x + block.width / 2}
              y={block.y + block.height / 2 + 3}
              textAnchor="middle"
              fill={isHighlighted ? "#fff" : "currentColor"}
              fontSize="6"
              fontWeight={isHighlighted ? "bold" : "normal"}
              opacity={isHighlighted ? 1 : 0.5}
            >
              {block.id}
            </text>
          );
        })}
      </svg>
      
      {selectedBlocks.length > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs text-muted-foreground mt-2"
        >
          Your seats are in the highlighted zone
        </motion.p>
      )}
    </div>
  );
};
