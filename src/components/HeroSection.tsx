import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-morocco.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Morocco World Cup 2030"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        <div className="absolute inset-0 bg-pattern-zellige opacity-30" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full text-primary-foreground text-sm font-medium border border-primary/30">
              <span className="w-2 h-2 bg-morocco-gold rounded-full animate-pulse" />
              FIFA World Cup 2030
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-background mb-6 leading-tight"
          >
            Welcome to the
            <span className="block text-morocco-gold">Kingdom of Morocco</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-background/80 mb-8 max-w-2xl"
          >
            Experience the magic of football in Africa's most enchanting destination. 
            Six incredible cities, world-class stadiums, and a rich cultural heritage 
            await you in 2030.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/cities"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all hover:scale-105"
            >
              Explore Host Cities
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/stadiums"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background/10 backdrop-blur-sm text-background font-semibold rounded-full border border-background/30 hover:bg-background/20 transition-all"
            >
              <Play size={18} />
              Discover Stadiums
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-background/20"
          >
            <div>
              <p className="font-display text-3xl sm:text-4xl font-bold text-morocco-gold">6</p>
              <p className="text-background/70 text-sm">Host Cities</p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-bold text-morocco-gold">6</p>
              <p className="text-background/70 text-sm">World-Class Stadiums</p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-bold text-morocco-gold">1M+</p>
              <p className="text-background/70 text-sm">Expected Visitors</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-background/30 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-background rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};
