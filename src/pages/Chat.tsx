import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  message: string;
  sender_id: string;
  created_at: string;
}

interface Chat {
  id: string;
  car_id: string;
  buyer_id: string;
  seller_id: string;
  cars: {
    make: string;
    model: string;
    year: number;
    price: number;
  };
}

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user && chatId) {
      fetchChat();
      fetchMessages();
    }
  }, [user, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const fetchChat = async () => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .select(`
          *,
          cars (make, model, year, price)
        `)
        .eq("id", chatId)
        .single();

      if (error) throw error;
      setChat(data);
    } catch (error) {
      console.error("Error fetching chat:", error);
      toast({
        title: "Error",
        description: "Failed to load chat",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !chatId) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            chat_id: chatId,
            sender_id: user.id,
            message: newMessage.trim(),
          },
        ]);

      if (error) throw error;

      setNewMessage("");
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Chat not found</h2>
          <Button asChild>
            <Link to="/profile">Back to Profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  const otherUserId = chat.buyer_id === user?.id ? chat.seller_id : chat.buyer_id;
  const isUserBuyer = chat.buyer_id === user?.id;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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

        <Card className="h-[600px] flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between">
              <div>
                <h2 className="text-lg">
                  {chat.cars.year} {chat.cars.make} {chat.cars.model}
                </h2>
                <p className="text-sm text-muted-foreground">
                  ${chat.cars.price.toLocaleString()} • {isUserBuyer ? "Seller" : "Buyer"} Chat
                </p>
              </div>
            </CardTitle>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === user?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender_id === user?.id
                          ? "bg-primary text-primary-foreground ml-4"
                          : "bg-muted mr-4"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender_id === user?.id
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;