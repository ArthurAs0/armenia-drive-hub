import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface ChatData {
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
    images: string[];
  };
  last_message?: {
    message: string;
    created_at: string;
    sender_id: string;
  };
}

interface ChatsListProps {
  user: any;
}

export const ChatsList = ({ user }: ChatsListProps) => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const fetchChats = async () => {
    if (!user) return;

    try {
      // First get all chats where user is buyer or seller
      const { data: chatsData, error: chatsError } = await supabase
        .from("chats")
        .select(`
          *,
          cars (make, model, year, price, images)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (chatsError) throw chatsError;

      // Get last message for each chat
      const chatsWithMessages = await Promise.all(
        (chatsData || []).map(async (chat) => {
          const { data: lastMessage } = await supabase
            .from("messages")
            .select("message, created_at, sender_id")
            .eq("chat_id", chat.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...chat,
            last_message: lastMessage
          };
        })
      );

      setChats(chatsWithMessages);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chats...</p>
        </CardContent>
      </Card>
    );
  }

  if (chats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Conversations</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
          <p className="text-muted-foreground mb-4">
            Start browsing cars to connect with sellers
          </p>
          <Button onClick={() => navigate("/buy")}>
            Browse Cars
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Conversations</h2>
        <Badge variant="secondary">
          {chats.length} active chat{chats.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {chats.map((chat) => {
          const isUserBuyer = chat.buyer_id === user.id;
          const userRole = isUserBuyer ? "Buyer" : "Seller";
          
          return (
            <Card 
              key={chat.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleChatClick(chat.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={chat.cars.images?.[0] || "/api/placeholder/80/60"}
                    alt={`${chat.cars.make} ${chat.cars.model}`}
                    className="w-16 h-12 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/api/placeholder/80/60";
                    }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {chat.cars.year} {chat.cars.make} {chat.cars.model}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {userRole}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium text-primary mb-2">
                      ${chat.cars.price.toLocaleString()}
                    </p>
                    
                    {chat.last_message ? (
                      <div className="text-sm text-muted-foreground">
                        <p className="truncate mb-1">
                          {chat.last_message.sender_id === user.id ? "You: " : ""}
                          {chat.last_message.message}
                        </p>
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3" />
                          {new Date(chat.last_message.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No messages yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};