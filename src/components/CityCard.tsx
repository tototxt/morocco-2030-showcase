import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

interface CityCardProps {
  name: string;
  slug: string;
  description: string;
  image: string;
  index?: number;
}

export const CityCard = ({ name, slug, description, image, index = 0 }: CityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card shadow-lg card-hover">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          
          {/* City Name Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-background/80 mb-1">
              <MapPin size={14} />
              <span className="text-sm font-medium">Morocco</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-background">{name}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
          <Link
            to={`/stadium/${slug}`}
            className="inline-flex items-center gap-2 text-primary font-semibold group/link"
          >
            View Stadium
            <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
