import { useState, useEffect } from "react";
import { Plus, X, Car, Fuel, Gauge, Calendar, MapPin, DollarSign, Home } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface CarData {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  mileage: string;
  fuel: string;
  transmission: string;
  location: string;
  engine: string;
  doors: number;
  seats: number;
  color: string;
  bodyType: string;
}

const Compare = () => {
  const [selectedCars, setSelectedCars] = useState<CarData[]>([]);
  const [availableCars, setAvailableCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    // Check if car ID is in URL params and add it
    const carIds = searchParams.get('cars');
    if (carIds && availableCars.length > 0) {
      const carIdArray = carIds.split(',');
      const carsToAdd = availableCars.filter(car => 
        carIdArray.includes(car.id.toString()) && 
        !selectedCars.find(selected => selected.id === car.id)
      );
      if (carsToAdd.length > 0) {
        setSelectedCars(prev => [...prev, ...carsToAdd]);
      }
    }
  }, [searchParams, availableCars]);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedCars: CarData[] = (data || []).map(car => ({
        id: parseInt(car.id),
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        image: car.image_url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop',
        mileage: car.mileage,
        fuel: car.fuel,
        transmission: car.transmission,
        location: car.location,
        engine: "Modern Engine",
        doors: 4,
        seats: 5,
        color: "Various",
        bodyType: "Modern"
      }));

      setAvailableCars(formattedCars);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockCars: CarData[] = [
    {
      id: 1,
      make: "BMW",
      model: "X5",
      year: 2023,
      price: 65000,
      image: "/api/placeholder/300/200",
      mileage: "15,000 km",
      fuel: "Petrol",
      transmission: "Automatic",
      location: "Yerevan",
      engine: "3.0L V6",
      doors: 5,
      seats: 7,
      color: "Black",
      bodyType: "SUV"
    },
    {
      id: 2,
      make: "Mercedes-Benz",
      model: "C-Class",
      year: 2022,
      price: 45000,
      image: "/api/placeholder/300/200",
      mileage: "22,000 km",
      fuel: "Petrol",
      transmission: "Automatic",
      location: "Gyumri",
      engine: "2.0L I4",
      doors: 4,
      seats: 5,
      color: "Silver",
      bodyType: "Sedan"
    },
    {
      id: 3,
      make: "Toyota",
      model: "Camry",
      year: 2021,
      price: 28000,
      image: "/api/placeholder/300/200",
      mileage: "35,000 km",
      fuel: "Hybrid",
      transmission: "CVT",
      location: "Vanadzor",
      engine: "2.5L Hybrid",
      doors: 4,
      seats: 5,
      color: "White",
      bodyType: "Sedan"
    },
    {
      id: 4,
      make: "Audi",
      model: "A4",
      year: 2023,
      price: 52000,
      image: "/api/placeholder/300/200",
      mileage: "8,000 km",
      fuel: "Petrol",
      transmission: "Automatic",
      location: "Yerevan",
      engine: "2.0L I4 Turbo",
      doors: 4,
      seats: 5,
      color: "Blue",
      bodyType: "Sedan"
    }
  ];

  const handleAddCar = (carId: string) => {
    const allCars = [...availableCars, ...mockCars];
    const car = allCars.find(c => c.id.toString() === carId);
    if (car && selectedCars.length < 3 && !selectedCars.find(c => c.id === car.id)) {
      setSelectedCars([...selectedCars, car]);
    }
  };

  const handleRemoveCar = (carId: number) => {
    setSelectedCars(selectedCars.filter(car => car.id !== carId));
  };

  const comparisonData = [
    { label: "Price", key: "price", format: (value: any) => `$${value.toLocaleString()}` },
    { label: "Year", key: "year" },
    { label: "Mileage", key: "mileage" },
    { label: "Fuel Type", key: "fuel" },
    { label: "Transmission", key: "transmission" },
    { label: "Engine", key: "engine" },
    { label: "Body Type", key: "bodyType" },
    { label: "Doors", key: "doors" },
    { label: "Seats", key: "seats" },
    { label: "Color", key: "color" },
    { label: "Location", key: "location" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Compare Cars</h1>
            <p className="text-lg text-muted-foreground">
              Compare up to 3 cars side by side to make the best decision
            </p>
          </div>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </Button>
        </div>

        {/* Add Cars Section */}
        {selectedCars.length < 3 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Cars to Compare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleAddCar}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a car to add to comparison" />
                </SelectTrigger>
                <SelectContent>
                  {[...availableCars, ...mockCars]
                    .filter(car => !selectedCars.find(selected => selected.id === car.id))
                    .map(car => (
                      <SelectItem key={car.id} value={car.id.toString()}>
                        {car.year} {car.make} {car.model} - ${car.price.toLocaleString()}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Comparison Section */}
        {selectedCars.length > 0 ? (
          <div className="space-y-6">
            {/* Car Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCars.map((car) => (
                <Card key={car.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => handleRemoveCar(car.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <div className="relative">
                    <img 
                      src={car.image} 
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {car.make} {car.model}
                    </h3>
                    <div className="text-2xl font-bold text-primary mb-4">
                      ${car.price.toLocaleString()}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{car.year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-muted-foreground" />
                        <span>{car.mileage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-muted-foreground" />
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{car.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium">Feature</th>
                        {selectedCars.map((car) => (
                          <th key={car.id} className="text-left p-3 font-medium min-w-[200px]">
                            {car.make} {car.model}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((item) => (
                        <tr key={item.key} className="border-b border-border/50">
                          <td className="p-3 font-medium text-muted-foreground">
                            {item.label}
                          </td>
                          {selectedCars.map((car) => (
                            <td key={car.id} className="p-3">
                              {item.format 
                                ? item.format(car[item.key as keyof CarData])
                                : car[item.key as keyof CarData]
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Price Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Price Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCars.map((car, index) => {
                    const minPrice = Math.min(...selectedCars.map(c => c.price));
                    const maxPrice = Math.max(...selectedCars.map(c => c.price));
                    const percentage = ((car.price - minPrice) / (maxPrice - minPrice)) * 100;
                    
                    return (
                      <div key={car.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {car.make} {car.model}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">
                              ${car.price.toLocaleString()}
                            </span>
                            {car.price === minPrice && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Lowest
                              </Badge>
                            )}
                            {car.price === maxPrice && selectedCars.length > 1 && (
                              <Badge variant="secondary" className="bg-red-100 text-red-800">
                                Highest
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage || 5}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Cars Selected
              </h3>
              <p className="text-muted-foreground mb-4">
                Add cars to start comparing their features and prices
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Compare;