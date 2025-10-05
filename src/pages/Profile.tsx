import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Car, Heart, MessageCircle, Settings, LogOut, Edit, DollarSign } from "lucide-react";
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
import { useFavorites } from "@/hooks/useFavorites";
import { ChatsList } from "@/components/ChatsList";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [favoriteCarsData, setFavoriteCarsData] = useState<any[]>([]);
  const [profile, setProfile] = useState({
    display_name: "",
    phone: "",
    location: ""
  });
  
  const { favoriteIds, toggleFavorite, isFavorited, refetchFavorites } = useFavorites(user);

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
        .maybeSingle();
      
      if (profileData) {
        setProfile({
          display_name: profileData.display_name || "",
          phone: profileData.phone || "",
          location: profileData.location || ""
        });
      }
      
      // Fetch user's car listings
      await fetchUserListings(user.id);
      
      // Fetch user's favorite cars
      await fetchFavoriteCars(user.id);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserListings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("seller_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setMyListings(data || []);
    } catch (error) {
      console.error("Error fetching user listings:", error);
    }
  };

  const fetchFavoriteCars = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          car_id,
          cars (*)
        `)
        .eq("user_id", userId);
      
      if (error) throw error;
      setFavoriteCarsData(data?.map((fav: any) => fav.cars) || []);
    } catch (error) {
      console.error("Error fetching favorite cars:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const { error} = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          display_name: profile.display_name,
          phone: profile.phone,
          location: profile.location,
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

  const handleMarkAsSold = async (carId: string) => {
    try {
      const { error } = await supabase
        .from("cars")
        .update({ is_sold: true })
        .eq("id", carId)
        .eq("seller_id", user?.id);

      if (error) throw error;

      // Refresh listings
      await fetchUserListings(user.id);
      
      toast({
        title: "Car marked as sold",
        description: "Your listing has been marked as sold.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditListing = (carId: string) => {
    navigate(`/sell?edit=${carId}`);
  };

  const handleViewCarDetails = (carId: string) => {
    navigate(`/car/${carId}`);
  };


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
                  {profile.display_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {profile.display_name || "User Profile"}
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="chats">Chats</TabsTrigger>
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
                  <div className="text-2xl font-bold text-foreground">{favoriteCarsData.length}</div>
                  <p className="text-muted-foreground">Favorites</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {myListings.length}
                  </div>
                  <p className="text-muted-foreground">Total Listings</p>
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
            {myListings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                  <p className="text-muted-foreground mb-4">Start selling your first car today!</p>
                  <Button onClick={() => navigate('/sell')}>
                    List Your First Car
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myListings.map((car) => (
                  <Card key={car.id}>
                    <div className="relative">
                      <img 
                        src={car.image_url || "/api/placeholder/300/200"} 
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/api/placeholder/300/200";
                        }}
                      />
                      <Badge 
                        className={`absolute top-3 right-3 ${
                          car.verified
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {car.verified ? "Active" : "Sold"}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {car.year} {car.make} {car.model}
                      </h3>
                      <div className="text-xl font-bold text-primary mb-3">
                        ${car.price.toLocaleString()}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <span className="font-medium">Location:</span> {car.location}
                        </div>
                        <div>
                          <span className="font-medium">Mileage:</span> {car.mileage}
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleViewCarDetails(car.id)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                        {car.verified && (
                          <Button 
                            variant="secondary" 
                            className="w-full"
                            onClick={() => handleMarkAsSold(car.id)}
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Mark as Sold
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {favoriteCarsData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-4">Start adding cars to your favorites to see them here!</p>
                  <Button onClick={() => navigate('/buy')}>
                    Browse Cars
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteCarsData.map((car) => (
                  <Card key={car.id}>
                    <div className="relative">
                      <img 
                        src={car.image_url || "/api/placeholder/300/200"} 
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/api/placeholder/300/200";
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                        onClick={() => toggleFavorite(car.id)}
                      >
                        <Heart className={`w-4 h-4 ${isFavorited(car.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
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
                      
                      <Button 
                        className="w-full"
                        onClick={() => handleViewCarDetails(car.id)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="chats" className="space-y-6">
            <ChatsList user={user} />
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
                  <Label htmlFor="fullName">Display Name</Label>
                  <Input
                    id="fullName"
                    value={profile.display_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                    placeholder="Enter your display name"
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