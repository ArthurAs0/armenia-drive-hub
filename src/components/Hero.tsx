import { useState } from "react";
import { Search, MapPin, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-car.jpg";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (location) params.set('location', location);
    navigate(`/buy?${params.toString()}`);
  };
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Premium car in elegant showroom" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl text-primary-foreground">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Find Your Perfect Car in 
            <span className="text-accent-glow"> Armenia</span>
          </h1>
          <p className="text-xl mb-8 text-primary-foreground/90 leading-relaxed">
            Discover thousands of quality vehicles from trusted dealers and private sellers. 
            Compare prices, features, and find the best deals in Armenia.
          </p>

          {/* Search Form */}
          <div className="bg-background/95 backdrop-blur-sm rounded-xl p-6 shadow-elegant">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <Input 
                placeholder="Search by make, model, or year..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background border-border text-lg py-3"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Location (e.g., Yerevan, Gyumri)" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
              <Button 
                size="lg" 
                variant="hero" 
                className="px-8"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4 mr-2" />
                Search Cars
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 text-center">
            <div>
              <div className="text-3xl font-bold text-accent-glow">10,000+</div>
              <div className="text-primary-foreground/80">Cars Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-glow">500+</div>
              <div className="text-primary-foreground/80">Verified Dealers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-glow">50,000+</div>
              <div className="text-primary-foreground/80">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;