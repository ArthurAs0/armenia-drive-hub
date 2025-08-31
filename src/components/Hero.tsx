import { Search, MapPin, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroImage from "@/assets/hero-car.jpg";

const Hero = () => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                  <SelectItem value="audi">Audi</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="camry">Camry</SelectItem>
                  <SelectItem value="corolla">Corolla</SelectItem>
                  <SelectItem value="prius">Prius</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-5000">$0 - $5,000</SelectItem>
                  <SelectItem value="5000-15000">$5,000 - $15,000</SelectItem>
                  <SelectItem value="15000-30000">$15,000 - $30,000</SelectItem>
                  <SelectItem value="30000+">$30,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Location (e.g., Yerevan, Gyumri)" 
                  className="pl-10 bg-background border-border"
                />
              </div>
              <Button size="lg" variant="hero" className="px-8">
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