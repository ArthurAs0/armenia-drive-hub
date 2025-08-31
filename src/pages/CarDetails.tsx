import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Share2, MessageCircle, Phone, Mail, Calendar, Fuel, Gauge, MapPin, Car, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  description: string | null;
}

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchCar(id);
      checkUser();
    }
  }, [id]);

  useEffect(() => {
    if (car && user) {
      checkFavorite(car.id);
    }
  }, [car, user]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const fetchCar = async (carId: string) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single();
      
      if (error) throw error;
      setCar(data);
    } catch (error) {
      console.error('Error fetching car:', error);
      toast({
        title: "Error",
        description: "Failed to load car details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async (carId: string) => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('car_id', carId)
        .maybeSingle();
      
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add favorites",
        variant: "destructive",
      });
      return;
    }

    if (!car) return;

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('car_id', car.id);
        
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Car removed from your favorites",
        });
      } else {
        await supabase
          .from('favorites')
          .insert([{ user_id: user.id, car_id: car.id }]);
        
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Car added to your favorites",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading car details...</h2>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Car not found</h2>
          <Link to="/buy">
            <Button>Browse Cars</Button>
          </Link>
        </div>
      </div>
    );
  }

  const features = [
    "Premium Interior",
    "Navigation System",
    "Backup Camera",
    "Heated Seats",
    "Sunroof",
    "Bluetooth Connectivity",
    "Parking Sensors",
    "LED Headlights",
    "Cruise Control",
    "Climate Control"
  ];

  const specs = {
    "Engine": "Modern Engine",
    "Power": "High Performance",
    "Transmission": car.transmission,
    "Fuel Type": car.fuel,
    "Year": car.year.toString(),
    "Mileage": car.mileage,
    "Location": car.location
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link to="/buy">
              <ArrowLeft className="w-4 h-4" />
              Back to Cars
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={car.image_url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop'} 
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {car.featured && (
                      <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                    )}
                    {car.verified && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className={`bg-background/80 hover:bg-background ${
                        isFavorite ? "text-red-600" : ""
                      }`}
                      onClick={toggleFavorite}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button size="icon" variant="ghost" className="bg-background/80 hover:bg-background">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Car Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl">
                      {car.year} {car.make} {car.model}
                    </CardTitle>
                    <p className="text-muted-foreground text-lg">{car.location}</p>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    ${car.price.toLocaleString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{car.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{car.mileage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{car.fuel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{car.transmission}</span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {car.description || `This ${car.year} ${car.make} ${car.model} is in excellent condition with ${car.mileage}. Features ${car.fuel} engine with ${car.transmission} transmission. Located in ${car.location}.`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features & Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technical Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border/50">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Seller */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Seller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Premium Car Dealer</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Dealer
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Seller
                  </Button>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Seller
                  </Button>
                </div>
                
                <div className="text-center text-sm text-muted-foreground pt-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {car.location}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button asChild className="w-full" variant="outline">
                  <Link to={`/compare?cars=${car.id}`}>
                    Add to Compare
                  </Link>
                </Button>
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={toggleFavorite}
                >
                  {isFavorite ? "Remove from Favorites" : "Save to Favorites"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;