import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Share2, MessageCircle, Phone, Mail, Calendar, Fuel, Gauge, MapPin, Car, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const CarDetails = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - replace with actual API call
  const carData = {
    id: 1,
    make: "BMW",
    model: "X5",
    year: 2023,
    price: 65000,
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    mileage: "15,000 km",
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Yerevan",
    color: "Black",
    bodyType: "SUV",
    engine: "3.0L V6 Twin Turbo",
    doors: 5,
    seats: 7,
    drive: "All-Wheel Drive",
    featured: true,
    verified: true,
    description: "This pristine 2023 BMW X5 is in excellent condition with low mileage. It features premium leather interior, navigation system, backup camera, heated seats, and much more. The vehicle has been well-maintained with complete service history. Perfect for families who want luxury and reliability.",
    features: [
      "Premium Leather Interior",
      "Navigation System",
      "Backup Camera",
      "Heated Seats",
      "Sunroof",
      "Bluetooth Connectivity",
      "Parking Sensors",
      "LED Headlights",
      "Cruise Control",
      "Climate Control"
    ],
    seller: {
      name: "Armenian Auto Dealer",
      type: "Dealer",
      phone: "+374 XX XXX XXX",
      email: "contact@dealership.am",
      location: "Yerevan",
      verified: true
    },
    specs: {
      "Engine": "3.0L V6 Twin Turbo",
      "Power": "335 HP",
      "Torque": "450 Nm",
      "Top Speed": "243 km/h",
      "0-100 km/h": "6.5 seconds",
      "Fuel Consumption": "9.1L/100km",
      "CO2 Emissions": "208 g/km",
      "Tank Capacity": "83L"
    }
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
                    src={carData.images[currentImageIndex]} 
                    alt={`${carData.make} ${carData.model}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {carData.featured && (
                      <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                    )}
                    {carData.verified && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="icon" variant="ghost" className="bg-background/80 hover:bg-background">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="bg-background/80 hover:bg-background">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Thumbnail Navigation */}
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {carData.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? "border-primary" : "border-border"
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
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
                      {carData.year} {carData.make} {carData.model}
                    </CardTitle>
                    <p className="text-muted-foreground text-lg">{carData.location}</p>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    ${carData.price.toLocaleString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{carData.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{carData.mileage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{carData.fuel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{carData.transmission}</span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {carData.description}
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
                  {carData.features.map((feature, index) => (
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
                  {Object.entries(carData.specs).map(([key, value]) => (
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
                    <p className="font-semibold">{carData.seller.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {carData.seller.type}
                      </Badge>
                      {carData.seller.verified && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      )}
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
                  {carData.seller.location}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Body Type</span>
                  <span className="font-medium">{carData.bodyType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Color</span>
                  <span className="font-medium">{carData.color}</span>
                </div>
                <div className="flex justify-between">
                  <span>Doors</span>
                  <span className="font-medium">{carData.doors}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seats</span>
                  <span className="font-medium">{carData.seats}</span>
                </div>
                <div className="flex justify-between">
                  <span>Drive Type</span>
                  <span className="font-medium">{carData.drive}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button asChild className="w-full" variant="outline">
                  <Link to={`/compare?cars=${carData.id}`}>
                    Add to Compare
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="secondary">
                  <Link to="/favorites">
                    Save to Favorites
                  </Link>
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