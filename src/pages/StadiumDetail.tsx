import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Calendar, MapPin, Check, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cities } from "@/data/cities";

const StadiumDetail = () => {
  const { slug } = useParams();
  const city = cities.find((c) => c.slug === slug);
  
  if (!city) {
    return <Navigate to="/cities" replace />;
  }

  const currentIndex = cities.findIndex((c) => c.slug === slug);
  const nextCity = cities[(currentIndex + 1) % cities.length];
  const prevCity = cities[(currentIndex - 1 + cities.length) % cities.length];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/cities"
              className="inline-flex items-center gap-2 text-background/70 hover:text-background transition-colors mb-6"
            >
              <ArrowLeft size={18} />
              Back to Cities
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-4"
          >
            <MapPin className="text-morocco-gold" size={24} />
            <span className="text-background/80 text-lg">Morocco</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-background mb-6"
          >
            {city.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-background/80 max-w-2xl"
          >
            {city.description}
          </motion.p>
        </div>
      </section>

      {/* Cultural Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-6">
                Cultural Heritage
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Discover {city.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {city.culturalDescription}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-80 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-3xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary/20 rounded-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stadium Section */}
      <section className="py-20 lg:py-32 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              World Cup Venue
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
              {city.stadium.name}
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Stadium Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={city.stadium.image}
                alt={city.stadium.name}
                className="w-full h-80 lg:h-[500px] object-cover"
              />
            </motion.div>

            {/* Stadium Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-card rounded-2xl p-6 shadow-lg">
                  <Users className="text-primary mb-3" size={28} />
                  <p className="font-display text-3xl font-bold">{city.stadium.capacity}</p>
                  <p className="text-muted-foreground text-sm">Seat Capacity</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-lg">
                  <Calendar className="text-primary mb-3" size={28} />
                  <p className="font-display text-xl font-bold">{city.stadium.yearBuilt}</p>
                  <p className="text-muted-foreground text-sm">Year Built/Renovated</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {city.stadium.description}
              </p>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-lg mb-4">Key Features</h4>
                {city.stadium.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-secondary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link
              to={`/stadium/${prevCity.slug}`}
              className="flex items-center gap-3 group"
            >
              <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Previous City</p>
                <p className="font-display font-semibold group-hover:text-primary transition-colors">
                  {prevCity.name}
                </p>
              </div>
            </Link>

            <Link
              to="/cities"
              className="px-6 py-3 bg-muted rounded-full font-medium hover:bg-muted/80 transition-colors"
            >
              All Cities
            </Link>

            <Link
              to={`/stadium/${nextCity.slug}`}
              className="flex items-center gap-3 group"
            >
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Next City</p>
                <p className="font-display font-semibold group-hover:text-primary transition-colors">
                  {nextCity.name}
                </p>
              </div>
              <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StadiumDetail;
