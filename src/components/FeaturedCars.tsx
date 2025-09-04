import { useState, useEffect } from "react";
import { Heart, Eye, MessageCircle, Fuel, Gauge, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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
const FeaturedCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const {
    toast
  } = useToast();
  const {
    toggleFavorite,
    isFavorited
  } = useFavorites(user);
  useEffect(() => {
    fetchFeaturedCars();
    checkUser();
  }, []);
  const checkUser = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };
  const fetchFeaturedCars = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('cars').select('*').eq('featured', true).limit(4);
      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast({
        title: "Error",
        description: "Failed to load featured cars",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Cars
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Loading featured cars...
            </p>
          </div>
        </div>
      </section>;
  }
  return <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Cars
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked premium vehicles from verified dealers and private sellers across Armenia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map(car => <Card key={car.id} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden bg-gradient-card border-border/50">
              <div className="relative">
                <img src={car.image_url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop'} alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 flex gap-2">
                  {car.featured && <Badge className="bg-accent text-accent-foreground font-semibold">
                      Featured
                    </Badge>}
                  {car.verified && <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Verified
                    </Badge>}
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button size="icon" variant="ghost" className="w-8 h-8 bg-background/80 hover:bg-background" onClick={() => toggleFavorite(car.id)}>
                    <Heart className={`w-4 h-4 transition-colors ${isFavorited(car.id) ? 'fill-red-500 text-red-500' : 'text-foreground hover:text-red-500'}`} />
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
                  <Link to="/compare">
                    Add to Compare
                  </Link>
                </Button>
              </CardFooter>
            </Card>)}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="accent" size="lg" className="px-8">
            <Link to="/buy">
              View All Cars
            </Link>
          </Button>
        </div>
      </div>
    </section>;
};
export default FeaturedCars;