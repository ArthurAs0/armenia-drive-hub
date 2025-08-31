import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Car, Heart, MessageCircle, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    location: ""
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      
      // Fetch profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          phone: "",
          location: ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          full_name: profile.full_name,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const myListings = [
    {
      id: 1,
      make: "BMW",
      model: "X5",
      year: 2023,
      price: 65000,
      image: "/api/placeholder/300/200",
      status: "Active",
      views: 245,
      inquiries: 12
    },
    {
      id: 2,
      make: "Mercedes-Benz",
      model: "C-Class",
      year: 2022,
      price: 45000,
      image: "/api/placeholder/300/200",
      status: "Sold",
      views: 189,
      inquiries: 8
    }
  ];

  const favoriteCars = [
    {
      id: 3,
      make: "Toyota",
      model: "Camry",
      year: 2021,
      price: 28000,
      image: "/api/placeholder/300/200",
      location: "Vanadzor"
    },
    {
      id: 4,
      make: "Audi",
      model: "A4",
      year: 2023,
      price: 52000,
      image: "/api/placeholder/300/200",
      location: "Yerevan"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {profile.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {profile.full_name || "User Profile"}
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Car className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{myListings.length}</div>
                  <p className="text-muted-foreground">Cars Listed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{favoriteCars.length}</div>
                  <p className="text-muted-foreground">Favorites</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {myListings.reduce((total, car) => total + car.inquiries, 0)}
                  </div>
                  <p className="text-muted-foreground">Total Inquiries</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <p className="text-sm">Your BMW X5 listing received 5 new views today</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <p className="text-sm">New inquiry received for your Mercedes-Benz C-Class</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <p className="text-sm">Profile updated successfully</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myListings.map((car) => (
                <Card key={car.id}>
                  <div className="relative">
                    <img 
                      src={car.image} 
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge 
                      className={`absolute top-3 right-3 ${
                        car.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {car.status}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <div className="text-xl font-bold text-primary mb-3">
                      ${car.price.toLocaleString()}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Views:</span> {car.views}
                      </div>
                      <div>
                        <span className="font-medium">Inquiries:</span> {car.inquiries}
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <Button variant="outline" className="w-full">
                        Edit Listing
                      </Button>
                      {car.status === "Active" && (
                        <Button variant="secondary" className="w-full">
                          Mark as Sold
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteCars.map((car) => (
                <Card key={car.id}>
                  <div className="relative">
                    <img 
                      src={car.image} 
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <div className="text-xl font-bold text-primary mb-2">
                      ${car.price.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{car.location}</p>
                    
                    <Button className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.full_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+374 XX XXX XXX"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Your city"
                  />
                </div>

                <Button onClick={handleUpdateProfile} className="w-full">
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;