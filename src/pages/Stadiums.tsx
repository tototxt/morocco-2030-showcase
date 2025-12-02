import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cities } from "@/data/cities";
import stadiumHero from "@/assets/stadium-casablanca.jpg";

const Stadiums = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={stadiumHero}
            alt="Stadium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/60" />
        </div>

        <div className="relative container mx-auto px-4 pt-20">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 bg-primary/20 text-primary-foreground rounded-full text-sm font-medium mb-6 backdrop-blur-sm"
            >
              World-Class Infrastructure
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6"
            >
              Morocco's{" "}
              <span className="text-morocco-gold">World Cup Stadiums</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-background/80 max-w-2xl"
            >
              Six magnificent venues combining cutting-edge technology with 
              traditional Moroccan architecture. From the 115,000-seat Grand 
              Stade de Casablanca to intimate city stadiums, each venue offers 
              a unique matchday experience.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-8 mt-10"
            >
              <div>
                <p className="text-3xl font-display font-bold text-morocco-gold">428K+</p>
                <p className="text-background/60 text-sm">Total Capacity</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-morocco-gold">6</p>
                <p className="text-background/60 text-sm">Venues</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-morocco-gold">3</p>
                <p className="text-background/60 text-sm">New/Renovated</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stadiums List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {cities.map((city, index) => (
              <motion.div
                key={city.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-3xl overflow-hidden shadow-lg card-hover"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={city.stadium.image}
                      alt={city.stadium.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-foreground/80 backdrop-blur-sm text-background text-sm font-medium rounded-full">
                        {city.name}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-10">
                    <h3 className="font-display text-2xl lg:text-3xl font-bold mb-4">
                      {city.stadium.name}
                    </h3>

                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users size={18} />
                        <span className="text-sm">{city.stadium.capacity} seats</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={18} />
                        <span className="text-sm">{city.stadium.yearBuilt}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {city.stadium.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {city.stadium.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-xs font-medium"
                        >
                          <Sparkles size={12} className="text-primary" />
                          {feature}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/stadium/${city.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold group"
                    >
                      View Full Details
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Stadiums;
