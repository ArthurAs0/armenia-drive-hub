import { useState, useEffect } from "react";
import { Heart, Eye, MessageCircle, Fuel, Gauge, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  created_at: string;
}

const Favorites = () => {
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavoriteCars();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const fetchFavoriteCars = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          car_id,
          cars (*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const cars = data?.map(fav => fav.cars).filter(Boolean) || [];
      setFavoriteCars(cars);
    } catch (error) {
      console.error('Error fetching favorite cars:', error);
      toast({
        title: "Error",
        description: "Failed to load favorite cars",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (carId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('car_id', carId);
      
      if (error) throw error;
      
      setFavoriteCars(favoriteCars.filter(car => car.id !== carId));
      toast({
        title: "Removed from favorites",
        description: "Car removed from your favorites",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setFavoriteCars([]);
      toast({
        title: "Favorites cleared",
        description: "All favorites have been removed",
      });
    } catch (error) {
      console.error('Error clearing favorites:', error);
      toast({
        title: "Error",
        description: "Failed to clear favorites",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">My Favorites</h1>
              <p className="text-lg text-muted-foreground">
                Cars you've saved for later viewing
              </p>
            </div>
            {favoriteCars.length > 0 && (
              <Button variant="outline" onClick={handleClearAll}>
                Clear All
              </Button>
            )}
          </div>
        </div>

        {favoriteCars.length === 0 ? (
          /* Empty State */
          <Card>
            <CardContent className="text-center py-16">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                No Favorite Cars Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start browsing cars and save your favorites to see them here
              </p>
              <Button asChild>
                <Link to="/buy">
                  Browse Cars
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Cars Grid */
          <div className="space-y-6">
            {/* Summary */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {favoriteCars.length} car{favoriteCars.length !== 1 ? 's' : ''} in your favorites
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteCars.map((car) => (
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
                          onClick={() => handleRemoveFavorite(car.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="w-8 h-8 bg-background/80 hover:bg-background">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Date Added */}
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="bg-background/90 text-foreground text-xs">
                          Added {new Date(car.created_at).toLocaleDateString()}
                        </Badge>
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
            )}

            {/* Actions */}
            <div className="text-center pt-8">
              <div className="space-y-4">
                <Button asChild size="lg">
                  <Link to="/buy">
                    Find More Cars
                  </Link>
                </Button>
                <div>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/compare">
                      Compare Selected Cars
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;