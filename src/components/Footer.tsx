import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">M</span>
              </div>
              <div>
                <p className="font-display font-bold text-xl">Morocco 2030</p>
                <p className="text-sm text-background/60">FIFA World Cup</p>
              </div>
            </div>
            <p className="text-background/70 max-w-md">
              Experience the magic of football in the Kingdom of Morocco. Six incredible cities, 
              world-class stadiums, and a rich cultural heritage await you in 2030.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/70 hover:text-background transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cities" className="text-background/70 hover:text-background transition-colors">
                  Host Cities
                </Link>
              </li>
              <li>
                <Link to="/stadiums" className="text-background/70 hover:text-background transition-colors">
                  Stadiums
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/70 hover:text-background transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Host Cities</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/stadium/casablanca" className="text-background/70 hover:text-background transition-colors">
                  Casablanca
                </Link>
              </li>
              <li>
                <Link to="/stadium/rabat" className="text-background/70 hover:text-background transition-colors">
                  Rabat
                </Link>
              </li>
              <li>
                <Link to="/stadium/marrakech" className="text-background/70 hover:text-background transition-colors">
                  Marrakech
                </Link>
              </li>
              <li>
                <Link to="/stadium/tangier" className="text-background/70 hover:text-background transition-colors">
                  Tangier
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © 2030 Morocco World Cup. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-morocco-red rounded-sm"></div>
            <div className="w-6 h-4 bg-morocco-green rounded-sm"></div>
            <span className="text-background/60 text-sm ml-2">Kingdom of Morocco</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
