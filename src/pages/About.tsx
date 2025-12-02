import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Heart, Shield, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/hero-morocco.jpg";
import marrakechImg from "@/assets/marrakech.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Morocco"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/60" />
        </div>

        <div className="relative container mx-auto px-4 pt-20">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 bg-morocco-gold/20 text-morocco-gold rounded-full text-sm font-medium mb-6 backdrop-blur-sm"
            >
              Morocco 2030
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6"
            >
              A Dream Becoming{" "}
              <span className="text-morocco-gold">Reality</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-background/80 max-w-2xl"
            >
              After decades of passionate pursuit, Morocco will co-host the FIFA 
              World Cup 2030, writing a new chapter in football history alongside 
              Spain and Portugal.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                Our Vision
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Bridging Continents Through Football
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                The 2030 FIFA World Cup will be historic as the first tournament 
                hosted across three continents – Africa, Europe, and for the centenary 
                celebration matches, South America. Morocco's participation represents 
                Africa's growing prominence in global football.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                With six host cities, state-of-the-art stadiums, and millennia of 
                rich cultural heritage, Morocco is ready to welcome the world. Our 
                vision is to create an unforgettable celebration of football that 
                showcases the best of Moroccan hospitality, innovation, and passion 
                for the beautiful game.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={marrakechImg}
                  alt="Morocco culture"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-morocco-gold/20 rounded-3xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4"
            >
              What We Stand For
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold"
            >
              Our Core Values
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: "Unity",
                description: "Bringing together nations and cultures through the universal language of football."
              },
              {
                icon: Heart,
                title: "Hospitality",
                description: "Welcoming the world with Morocco's legendary warmth and generosity."
              },
              {
                icon: Shield,
                title: "Sustainability",
                description: "Committed to hosting an environmentally responsible tournament."
              },
              {
                icon: Sparkles,
                title: "Innovation",
                description: "Showcasing cutting-edge technology and world-class infrastructure."
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
            >
              The Journey
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold"
            >
              Morocco's World Cup Journey
            </motion.h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {[
              { year: "1994", event: "First World Cup bid" },
              { year: "1998", event: "Second bid for hosting rights" },
              { year: "2006", event: "Third bid attempt" },
              { year: "2010", event: "Fourth bid for World Cup" },
              { year: "2018", event: "Fifth bid submission" },
              { year: "2022", event: "Historic fourth place at Qatar World Cup" },
              { year: "2023", event: "Joint bid with Spain and Portugal announced" },
              { year: "2024", event: "Official selection as 2030 co-host" },
              { year: "2030", event: "Morocco hosts the FIFA World Cup", highlight: true }
            ].map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 mb-6"
              >
                <div className={`w-20 text-right font-display font-bold ${
                  item.highlight ? "text-primary text-2xl" : "text-muted-foreground"
                }`}>
                  {item.year}
                </div>
                <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                  item.highlight ? "bg-primary" : "bg-border"
                }`} />
                <div className={`flex-1 p-4 rounded-xl ${
                  item.highlight ? "bg-primary/10 font-semibold" : "bg-muted"
                }`}>
                  {item.event}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Ready to Explore{" "}
            <span className="text-morocco-gold">Morocco 2030</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-background/70 mb-8 max-w-2xl mx-auto"
          >
            Discover the cities, explore the stadiums, and start planning your 
            journey to the 2030 FIFA World Cup in Morocco.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              to="/cities"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all"
            >
              Explore Host Cities
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
