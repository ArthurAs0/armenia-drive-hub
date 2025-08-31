import { useState } from "react";
import { Send, Bot, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const Chat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant for StartDrive. I can help you find cars, answer questions about vehicles, pricing, and guide you through buying or selling process. How can I help you today?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response (replace with actual OpenAI API call)
    try {
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: getAIResponse(inputMessage),
          role: "assistant",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("price") || input.includes("cost")) {
      return "I can help you with pricing information! Car prices vary based on make, model, year, condition, and mileage. For example, a 2023 BMW X5 typically ranges from $60,000-$70,000. Would you like pricing information for a specific vehicle?";
    }
    
    if (input.includes("bmw") || input.includes("mercedes") || input.includes("toyota")) {
      return "Great choice! These are popular brands in Armenia. I can help you find specific models, compare features, or check current availability. What particular model are you interested in?";
    }
    
    if (input.includes("sell") || input.includes("selling")) {
      return "To sell your car on StartDrive: 1) Go to our Sell Car page, 2) Fill out the detailed form with your car's information, 3) Upload high-quality photos, 4) Set a competitive price, 5) Our team will verify and publish your listing. The process usually takes 24-48 hours.";
    }
    
    if (input.includes("buy") || input.includes("buying")) {
      return "For buying a car: 1) Browse our Buy Cars section with advanced filters, 2) Use the search to find specific models, 3) View detailed car information and photos, 4) Contact sellers directly through our platform, 5) Arrange viewings and inspections. Would you like help finding a specific type of car?";
    }
    
    return "I'm here to help with all your car-related questions! I can assist with finding cars, pricing information, buying/selling process, comparisons between models, and general automotive advice. What specific information are you looking for?";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">AI Car Assistant</h1>
          <p className="text-lg text-muted-foreground">
            Get instant help with car buying, selling, and automotive questions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[480px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      
                      {message.role === "user" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="max-w-[70%] rounded-lg p-3 bg-muted">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            
            <div className="p-4 border-t border-border">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about cars..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;