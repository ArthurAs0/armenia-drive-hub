import { Heart, Eye, MessageCircle, Fuel, Gauge, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FeaturedCars = () => {
  const cars = [
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
      verified: true
    },
    {
      id: 2,
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
      verified: true
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
      verified: true
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
      verified: true
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
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
          {cars.map((car) => (
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
                  <Button size="icon" variant="ghost" className="w-8 h-8 bg-background/80 hover:bg-background">
                    <Heart className="w-4 h-4" />
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
                <Button className="w-full" variant="default">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button className="w-full" variant="outline">
                  Add to Compare
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="accent" size="lg" className="px-8">
            View All Cars
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;