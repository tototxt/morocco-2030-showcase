import casablancaImg from "@/assets/casablanca.jpg";
import rabatImg from "@/assets/rabat.jpg";
import marrakechImg from "@/assets/marrakech.jpg";
import tangierImg from "@/assets/tangier.jpg";
import agadirImg from "@/assets/agadir.jpg";
import fezImg from "@/assets/fez.jpg";
import stadiumCasablancaImg from "@/assets/stadium-casablanca.jpg";
import stadiumGenericImg from "@/assets/stadium-generic.jpg";

export interface City {
  name: string;
  slug: string;
  description: string;
  culturalDescription: string;
  image: string;
  stadium: {
    name: string;
    capacity: string;
    yearBuilt: string;
    description: string;
    image: string;
    features: string[];
  };
}

export const cities: City[] = [
  {
    name: "Casablanca",
    slug: "casablanca",
    description: "Morocco's largest city and economic capital, a vibrant metropolis where tradition meets modernity along the stunning Atlantic coastline.",
    culturalDescription: "Casablanca, the economic heart of Morocco, is a city of contrasts where Art Deco architecture stands alongside traditional medinas. Home to the magnificent Hassan II Mosque, one of the largest in the world, the city embodies Morocco's ambitious spirit. Its name, meaning 'white house' in Spanish, reflects its colonial heritage while its bustling souks and modern business districts showcase its dynamic present. The city's port has been a gateway between Africa and Europe for centuries, making it a cultural crossroads of extraordinary richness.",
    image: casablancaImg,
    stadium: {
      name: "Grand Stade de Casablanca",
      capacity: "115,000",
      yearBuilt: "2030 (New Construction)",
      description: "The crown jewel of Morocco 2030, the Grand Stade de Casablanca will be the largest stadium in Africa and one of the largest in the world. This ultramodern architectural marvel is specifically designed for the 2030 World Cup, featuring state-of-the-art facilities and a design inspired by Moroccan geometric patterns. It will host the opening match and several key fixtures of the tournament.",
      image: stadiumCasablancaImg,
      features: [
        "Largest stadium in Africa",
        "Retractable roof technology",
        "Moroccan geometric design elements",
        "Opening match venue",
        "100% renewable energy powered"
      ]
    }
  },
  {
    name: "Rabat",
    slug: "rabat",
    description: "The elegant capital city of Morocco, where royal palaces, ancient ruins, and modern institutions create a harmonious blend of history and governance.",
    culturalDescription: "Rabat, the political and administrative capital of Morocco, exudes an air of refined elegance. The city is home to the Royal Palace, the historic Kasbah of the Udayas with its distinctive blue and white houses, and the impressive Hassan Tower – a 12th-century minaret that has become a symbol of the nation. As a UNESCO World Heritage site, Rabat preserves centuries of Moroccan history while serving as a center of education and diplomacy. The city's boulevards are lined with orange trees, and its coastal position offers beautiful views of the Atlantic Ocean.",
    image: rabatImg,
    stadium: {
      name: "Stade Moulay Abdellah",
      capacity: "65,000",
      yearBuilt: "1983 (Major Renovation 2030)",
      description: "The Stade Moulay Abdellah, named after the late Moroccan king, is undergoing a spectacular transformation for 2030. The renovation incorporates contemporary Moroccan architectural elements while expanding capacity significantly. Its design pays homage to traditional Moroccan craftsmanship with modern zellige-inspired patterns. The stadium is expected to host semi-final matches.",
      image: stadiumGenericImg,
      features: [
        "Complete renovation for 2030",
        "Traditional Moroccan architectural elements",
        "Semi-final venue",
        "Enhanced VIP and media facilities",
        "Improved public transport connections"
      ]
    }
  },
  {
    name: "Marrakech",
    slug: "marrakech",
    description: "The Red City, a sensory wonderland of ancient medinas, magnificent gardens, and the majestic Atlas Mountains as its backdrop.",
    culturalDescription: "Marrakech, known as the 'Red City' for its distinctive terracotta buildings, is Morocco's most enchanting destination. Founded in 1070, the city has been a crossroads of African, Arab, and Berber cultures for nearly a millennium. The famous Jemaa el-Fnaa square comes alive each evening with storytellers, musicians, and food vendors. The city's riads (traditional houses), intricate souks, and stunning gardens like the Majorelle and Menara create an atmosphere of timeless magic. Surrounded by the snow-capped Atlas Mountains, Marrakech offers a unique blend of culture, adventure, and hospitality.",
    image: marrakechImg,
    stadium: {
      name: "Grand Stade de Marrakech",
      capacity: "45,000",
      yearBuilt: "2011 (Upgraded 2030)",
      description: "The Grand Stade de Marrakech is a modern marvel set against the stunning backdrop of the Atlas Mountains. Its design incorporates elements of traditional red-brick Moroccan architecture, seamlessly blending into the city's famous aesthetic. The stadium has hosted major international events and will be upgraded for 2030 to meet FIFA's highest standards.",
      image: stadiumGenericImg,
      features: [
        "Stunning Atlas Mountain views",
        "Red-brick architectural design",
        "Natural cooling system",
        "Close proximity to city center",
        "Upgraded facilities for 2030"
      ]
    }
  },
  {
    name: "Tangier",
    slug: "tangier",
    description: "Gateway between Africa and Europe, a cosmopolitan port city with a legendary artistic heritage and stunning Mediterranean views.",
    culturalDescription: "Tangier, perched at the northwestern tip of Africa where the Mediterranean meets the Atlantic, has long been a city of mystery and international intrigue. Its strategic position has made it a crossroads of civilizations for millennia, from Phoenicians to Romans to its famous 'International Zone' era. The city has inspired countless artists and writers, from Delacroix to Paul Bowles. Today, Tangier is experiencing a renaissance, with the new Tanger Med port, high-speed rail connections, and a thriving cultural scene that honors its cosmopolitan past while embracing the future.",
    image: tangierImg,
    stadium: {
      name: "Stade Ibn Battouta",
      capacity: "68,000",
      yearBuilt: "2011 (Extended 2030)",
      description: "Named after the famous Moroccan explorer Ibn Battouta, this stadium embodies Tangier's spirit of adventure and connection. Having successfully hosted the 2022 FIFA Club World Cup, the stadium is being extended for 2030 with additional seating and enhanced facilities. Its location offers spectacular views of the Strait of Gibraltar.",
      image: stadiumGenericImg,
      features: [
        "Named after explorer Ibn Battouta",
        "Hosted FIFA Club World Cup 2022",
        "Views of the Strait of Gibraltar",
        "Extended capacity for 2030",
        "World-class hospitality facilities"
      ]
    }
  },
  {
    name: "Agadir",
    slug: "agadir",
    description: "Morocco's premier beach resort, rebuilt in stunning modern style with Amazigh cultural influences and year-round sunshine.",
    culturalDescription: "Agadir, rising from the ashes of a devastating 1960 earthquake, is a testament to Moroccan resilience and modern urban planning. The city's reconstruction incorporated the rich heritage of the Amazigh (Berber) people native to the region, creating a unique architectural style. Known for its pristine beaches, mild climate, and proximity to the Anti-Atlas mountains, Agadir is both a tourist paradise and a gateway to authentic Amazigh culture. The reconstructed kasbah offers panoramic views of the city and its famous crescent-shaped bay.",
    image: agadirImg,
    stadium: {
      name: "Stade Adrar",
      capacity: "45,000",
      yearBuilt: "2013 (Upgraded 2030)",
      description: "The Stade Adrar is renowned for its beautiful Amazigh-inspired architecture, featuring geometric patterns and designs that pay homage to the indigenous Berber culture of the region. The stadium's unique aesthetic makes it one of the most visually distinctive venues in African football. Upgrades for 2030 will enhance its facilities while preserving its cultural character.",
      image: stadiumGenericImg,
      features: [
        "Amazigh-inspired architecture",
        "Distinctive geometric patterns",
        "Year-round perfect weather",
        "Beach city location",
        "Enhanced fan experience for 2030"
      ]
    }
  },
  {
    name: "Fez",
    slug: "fez",
    description: "The spiritual and cultural heart of Morocco, home to the world's oldest university and the best-preserved medieval city in the Arab world.",
    culturalDescription: "Fez, founded in 789 AD, is Morocco's oldest imperial city and its spiritual capital. The medina of Fez el-Bali is a UNESCO World Heritage site and the world's largest car-free urban area, with over 9,000 narrow lanes and alleyways. Home to the University of Al-Qarawiyyin, the oldest existing university in the world, Fez has been a center of learning and craftsmanship for over a millennium. The city is famous for its traditional tanneries, intricate metalwork, and exquisite ceramics. Its preservation of medieval urban life offers visitors a journey back in time.",
    image: fezImg,
    stadium: {
      name: "Complexe Sportif de Fès",
      capacity: "45,000",
      yearBuilt: "2003 (Renovated 2030)",
      description: "The Complexe Sportif de Fès is undergoing comprehensive renovation to meet international standards for 2030. The upgraded stadium will feature modern amenities while incorporating design elements inspired by Fez's legendary craftsmanship, including zellige tilework and geometric patterns that echo the city's architectural heritage.",
      image: stadiumGenericImg,
      features: [
        "Renovated for 2030 standards",
        "Design inspired by Fassi craftsmanship",
        "Zellige tilework elements",
        "Improved accessibility",
        "Enhanced match-day experience"
      ]
    }
  }
];
