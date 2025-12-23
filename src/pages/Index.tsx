import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Users, MapPin, Building } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { CityCard } from "@/components/CityCard";
import { cities } from "@/data/cities";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Introduction Section */}
      <section className="py-20 lg:py-32 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6"
            >
              Co-Host of FIFA World Cup 2030
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            >
              A Historic Moment for{" "}
              <span className="text-gradient-morocco">Morocco & Africa</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              For the first time in history, the FIFA World Cup will be hosted across three continents. 
              Morocco, alongside Spain and Portugal, will welcome the world to an unprecedented celebration 
              of football. The Kingdom of Morocco brings six magnificent cities, world-class infrastructure, 
              and millennia of rich cultural heritage to this global celebration.
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {[
              { icon: MapPin, title: "6 Host Cities", desc: "From Casablanca to Fez" },
              { icon: Building, title: "6 Stadiums", desc: "World-class venues" },
              { icon: Users, title: "1M+ Visitors", desc: "Expected attendance" },
              { icon: Trophy, title: "48 Teams", desc: "Global competition" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Host Cities Preview */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4"
              >
                Discover Morocco
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="font-display text-3xl md:text-4xl font-bold"
              >
                Host Cities
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link
                to="/cities"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all mt-4 md:mt-0"
              >
                View All Cities
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.slice(0, 3).map((city, index) => (
              <CityCard
                key={city.slug}
                name={city.name}
                slug={city.slug}
                description={city.description}
                image={city.image}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            >
              Experience the Magic of{" "}
              <span className="text-morocco-gold">Morocco 2030</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-background/70 mb-8 max-w-2xl mx-auto"
            >
              Discover the stadiums, explore the cities, and immerse yourself in the rich 
              culture that awaits visitors in the Kingdom of Morocco.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/tickets"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-morocco-gold text-foreground font-semibold rounded-full hover:bg-morocco-gold/90 transition-all"
              >
                Buy Tickets
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/stadiums"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all"
              >
                Explore Stadiums
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background/10 backdrop-blur-sm text-background font-semibold rounded-full border border-background/30 hover:bg-background/20 transition-all"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
