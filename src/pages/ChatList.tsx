import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MessageCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatListItem {
  id: string;
  car_id: string;
  buyer_id: string;
  seller_id: string;
  updated_at: string;
  cars: {
    make: string;
    model: string;
    year: number;
    price: number;
    image_url: string | null;
  };
  last_message?: {
    message: string;
    created_at: string;
  };
}

const ChatList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/auth");
    }
  };

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .select(`
          *,
          cars (make, model, year, price, image_url)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Fetch last message for each chat
      const chatsWithMessages = await Promise.all(
        (data || []).map(async (chat) => {
          const { data: messages } = await supabase
            .from("messages")
            .select("message, created_at")
            .eq("chat_id", chat.id)
            .order("created_at", { ascending: false })
            .limit(1);

          return {
            ...chat,
            last_message: messages?.[0] || null,
          };
        })
      );

      setChats(chatsWithMessages);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast({
        title: "Error",
        description: "Failed to load chats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link to="/profile">
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Conversations</h1>
          <p className="text-muted-foreground">
            Manage your chats with buyers and sellers
          </p>
        </div>

        {chats.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
              <p className="text-muted-foreground mb-4">
                Start chatting with sellers or buyers to see conversations here
              </p>
              <Button asChild>
                <Link to="/buy-cars">Browse Cars</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => {
              const isUserBuyer = chat.buyer_id === user?.id;
              return (
                <Card
                  key={chat.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/chat/${chat.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Car Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={
                            chat.cars.image_url ||
                            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100&h=100&fit=crop"
                          }
                          alt={`${chat.cars.make} ${chat.cars.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold">
                            {chat.cars.year} {chat.cars.make} {chat.cars.model}
                          </h3>
                          <Badge variant={isUserBuyer ? "secondary" : "default"}>
                            {isUserBuyer ? "Buying" : "Selling"}
                          </Badge>
                        </div>
                        <p className="text-sm text-primary font-medium mb-2">
                          ${chat.cars.price.toLocaleString()}
                        </p>
                        
                        {chat.last_message && (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.last_message.message}
                            </p>
                            <p className="text-xs text-muted-foreground ml-2">
                              {new Date(chat.last_message.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        
                        {!chat.last_message && (
                          <p className="text-sm text-muted-foreground">
                            No messages yet - start the conversation!
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;