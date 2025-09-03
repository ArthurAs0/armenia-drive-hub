import { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal, Heart, Eye, MessageCircle, Fuel, Gauge, Calendar, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/useFavorites";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image_url: string | null;
  mileage: string;
  fuel: string;
  transmission: string;
  location: string;
  featured: boolean;
  verified: boolean;
}

const BuyCars = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const { toggleFavorite, isFavorited } = useFavorites(user);

  useEffect(() => {
    fetchCars();
    checkUser();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchQuery, priceRange, selectedMake, selectedYear, selectedFuel]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast({
        title: "Error",
        description: "Failed to load cars",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCars = () => {
    let filtered = cars.filter(car => {
      const matchesSearch = car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           car.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
      const matchesMake = !selectedMake || car.make === selectedMake;
      const matchesYear = !selectedYear || car.year.toString() === selectedYear;
      const matchesFuel = !selectedFuel || car.fuel === selectedFuel;
      
      return matchesSearch && matchesPrice && matchesMake && matchesYear && matchesFuel;
    });
    setFilteredCars(filtered);
  };



  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Buy Cars</h1>
            <p className="text-lg text-muted-foreground">
              Find your perfect car from our extensive collection
            </p>
          </div>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by make, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Cars</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range</label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={100000}
                      min={0}
                      step={1000}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Make</label>
                    <Select value={selectedMake} onValueChange={setSelectedMake}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Makes</SelectItem>
                        <SelectItem value="BMW">BMW</SelectItem>
                        <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                        <SelectItem value="Toyota">Toyota</SelectItem>
                        <SelectItem value="Audi">Audi</SelectItem>
                        <SelectItem value="Honda">Honda</SelectItem>
                        <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Year</label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Years</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Fuel Type</label>
                    <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredCars.length} of {cars.length} cars
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Card key={car.id} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden bg-gradient-card border-border/50">
              <div className="relative">
                <img 
                  src={car.image_url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop'} 
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {car.featured && (
                    <Badge className="bg-accent text-accent-foreground font-semibold">
                      Featured
                    </Badge>
                  )}
                  {car.verified && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="w-8 h-8 bg-background/80 hover:bg-background"
                          onClick={() => toggleFavorite(car.id)}
                        >
                          <Heart 
                            className={`w-4 h-4 transition-colors ${
                              isFavorited(car.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-foreground hover:text-red-500'
                            }`} 
                          />
                        </Button>
                  <Button size="icon" variant="ghost" className="w-8 h-8 bg-background/80 hover:bg-background">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-muted-foreground">{car.year} • {car.location}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    <span>{car.mileage}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="w-3 h-3" />
                    <span>{car.fuel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{car.year}</span>
                  </div>
                </div>

                <div className="text-2xl font-bold text-primary mb-4">
                  ${car.price.toLocaleString()}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 space-y-2">
                <Button asChild className="w-full" variant="default">
                  <Link to={`/car/${car.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link to={`/compare?cars=${car.id}`}>
                    Add to Compare
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyCars;