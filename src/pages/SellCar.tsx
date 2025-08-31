import { useState } from "react";
import { Car, Upload, Camera, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const SellCar = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    price: "",
    fuel: "",
    transmission: "",
    color: "",
    location: "",
    description: "",
    phone: "",
    email: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Car listing submitted!",
      description: "Your car has been submitted for review. We'll contact you soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Sell Your Car</h1>
          <p className="text-lg text-muted-foreground">
            List your car and reach thousands of potential buyers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Car Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Car Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Select value={formData.make} onValueChange={(value) => handleInputChange("make", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BMW">BMW</SelectItem>
                        <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                        <SelectItem value="Toyota">Toyota</SelectItem>
                        <SelectItem value="Audi">Audi</SelectItem>
                        <SelectItem value="Honda">Honda</SelectItem>
                        <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                        <SelectItem value="Ford">Ford</SelectItem>
                        <SelectItem value="Hyundai">Hyundai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                      placeholder="e.g., X5, C-Class"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mileage">Mileage (km)</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => handleInputChange("mileage", e.target.value)}
                      placeholder="e.g., 25000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fuel">Fuel Type</Label>
                    <Select value={formData.fuel} onValueChange={(value) => handleInputChange("fuel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="LPG">LPG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select value={formData.transmission} onValueChange={(value) => handleInputChange("transmission", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="CVT">CVT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                      placeholder="e.g., Black, White"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yerevan">Yerevan</SelectItem>
                        <SelectItem value="Gyumri">Gyumri</SelectItem>
                        <SelectItem value="Vanadzor">Vanadzor</SelectItem>
                        <SelectItem value="Kapan">Kapan</SelectItem>
                        <SelectItem value="Goris">Goris</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price & Contact */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Price & Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="e.g., 25000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+374 XX XXX XXX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Drag and drop photos here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Upload up to 10 photos (JPG, PNG)
                    </p>
                    <Button variant="outline" className="mt-4">
                      Choose Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="description">Car Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your car's condition, features, service history, etc."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-center">
            <Button type="submit" size="lg" className="px-12">
              List My Car
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellCar;