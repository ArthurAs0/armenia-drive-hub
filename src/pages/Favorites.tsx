import { useState } from "react";
import { Heart, Eye, MessageCircle, Fuel, Gauge, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [favoriteCars, setFavoriteCars] = useState([
    {
      id: 1,
      make: "BMW",
      model: "X5",
      year: 2023,
      price: 65000,
      image: "/api/placeholder/400/300",
      mileage: "15,000 km",
      fuel: "Petrol",
      transmission: "Automatic",
      location: "Yerevan",
      featured: true,
      verified: true,
      dateAdded: "2 days ago"
    },
    {
      id: 3,
      make: "Toyota",
      model: "Camry",
      year: 2021,
      price: 28000,
      image: "/api/placeholder/400/300",
      mileage: "35,000 km",
      fuel: "Hybrid",
      transmission: "CVT",
      location: "Vanadzor",
      featured: false,
      verified: true,
      dateAdded: "1 week ago"
    },
    {
      id: 4,
      make: "Audi",
      model: "A4",
      year: 2023,
      price: 52000,
      image: "/api/placeholder/400/300",
      mileage: "8,000 km",
      fuel: "Petrol",
      transmission: "Automatic",
      location: "Yerevan",
      featured: true,
      verified: true,
      dateAdded: "3 days ago"
    },
    {
      id: 5,
      make: "Mercedes-Benz",
      model: "C-Class",
      year: 2022,
      price: 45000,
      image: "/api/placeholder/400/300",
      mileage: "22,000 km",
      fuel: "Petrol",
      transmission: "Automatic",
      location: "Gyumri",
      featured: true,
      verified: true,
      dateAdded: "5 days ago"
    }
  ]);

  const handleRemoveFavorite = (carId: number) => {
    setFavoriteCars(favoriteCars.filter(car => car.id !== carId));
  };

  const handleClearAll = () => {
    setFavoriteCars([]);
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteCars.map((car) => (
                <Card key={car.id} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden bg-gradient-card border-border/50">
                  <div className="relative">
                    <img 
                      src={car.image} 
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
                        Added {car.dateAdded}
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