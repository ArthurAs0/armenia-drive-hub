import { useState, useEffect, useRef } from "react";
import { Car, Upload, Camera, DollarSign, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const carListingSchema = z.object({
  make: z.string().trim().min(1, "Make is required").max(50),
  model: z.string().trim().min(1, "Model is required").max(50),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().positive("Price must be positive").max(10000000),
  mileage: z.number().int().nonnegative("Mileage cannot be negative").max(1000000),
  fuel_type: z.enum(['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG']),
  transmission: z.enum(['Automatic', 'Manual', 'CVT']),
  location: z.string().min(1, "Location is required"),
  description: z.string().max(5000).optional(),
  color: z.string().max(30).optional(),
});

const SellCar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [carId, setCarId] = useState<string | null>(null);
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkUser();
    
    // Check if we're in edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const editCarId = urlParams.get('edit');
    if (editCarId) {
      setEditMode(true);
      setCarId(editCarId);
      loadCarData(editCarId);
    }
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to sell your car",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setUser(session.user);
  };

  const loadCarData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setFormData({
          make: data.make || "",
          model: data.model || "",
          year: data.year?.toString() || "",
          mileage: data.mileage?.toString() || "",
          price: data.price?.toString() || "",
          fuel: data.fuel_type || "",
          transmission: data.transmission || "",
          color: data.color || "",
          location: data.location || "",
          description: data.description || "",
          phone: "",
          email: ""
        });
        setExistingImages(data.images || []);
      }
    } catch (error) {
      console.error('Error loading car data:', error);
      toast({
        title: "Error",
        description: "Failed to load car data",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 10) {
      toast({
        title: "Too many files",
        description: "You can upload up to 10 photos",
        variant: "destructive",
      });
      return;
    }
    setSelectedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to sell your car",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Validate with zod
      const validated = carListingSchema.parse({
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseInt(formData.price),
        mileage: parseInt(formData.mileage),
        fuel_type: formData.fuel,
        transmission: formData.transmission,
        location: formData.location,
        description: formData.description || undefined,
        color: formData.color || undefined,
      });

      // Upload new images to storage
      const imageUrls: string[] = [...existingImages];
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('car-images')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error('Failed to upload images');
          }

          const { data: { publicUrl } } = supabase.storage
            .from('car-images')
            .getPublicUrl(fileName);
          
          imageUrls.push(publicUrl);
        }
      }

      if (editMode && carId) {
        // Update existing car
        const { error } = await supabase
          .from('cars')
          .update({
            make: validated.make,
            model: validated.model,
            year: validated.year,
            price: validated.price,
            mileage: validated.mileage,
            fuel_type: validated.fuel_type,
            transmission: validated.transmission,
            location: validated.location,
            description: validated.description,
            color: validated.color,
            images: imageUrls,
          })
          .eq('id', carId)
          .eq('seller_id', user.id);

        if (error) throw error;

        toast({
          title: "Car updated successfully!",
          description: "Your listing has been updated.",
        });
      } else {
        // Create new car listing
        const { error } = await supabase
          .from('cars')
          .insert([{
            make: validated.make,
            model: validated.model,
            year: validated.year,
            price: validated.price,
            mileage: validated.mileage,
            fuel_type: validated.fuel_type,
            transmission: validated.transmission,
            location: validated.location,
            description: validated.description,
            color: validated.color,
            images: imageUrls,
            seller_id: user.id
          }]);

        if (error) throw error;

        toast({
          title: "Car listed successfully!",
          description: "Your car has been listed and is now available for buyers to view.",
        });
      }
      
      // Reset form
      setFormData({
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
      setSelectedFiles([]);
      setExistingImages([]);
      
      // Navigate to profile to see the listing
      navigate('/profile');
      
    } catch (error) {
      console.error('Error creating listing:', error);
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: editMode ? "Failed to update listing. Please try again." : "Failed to create listing. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to sell your car</p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link to="/profile">
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {editMode ? 'Edit Your Car Listing' : 'Sell Your Car'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {editMode ? 'Update your car listing details' : 'List your car and reach thousands of potential buyers'}
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
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {existingImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Current Images:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {existingImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={url} 
                              alt={`Car ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== index))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={handleFileSelect}
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Drag and drop photos here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Upload up to 10 photos (JPG, PNG)
                    </p>
                    <Button type="button" variant="outline" className="mt-4" onClick={handleFileSelect}>
                      Select Files
                    </Button>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        {selectedFiles.length} new file{selectedFiles.length !== 1 ? 's' : ''} selected:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                          <span key={index} className="text-xs bg-secondary px-2 py-1 rounded">
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
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
            <Button type="submit" size="lg" className="px-12" disabled={loading}>
              {loading ? "Processing..." : editMode ? "Update Listing" : "List My Car"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellCar;