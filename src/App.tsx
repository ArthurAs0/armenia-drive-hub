import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import BuyCars from "./pages/BuyCars";
import SellCar from "./pages/SellCar";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";
import Compare from "./pages/Compare";
import Profile from "./pages/Profile";
import CarDetails from "./pages/CarDetails";
import Favorites from "./pages/Favorites";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/buy" element={<BuyCars />} />
            <Route path="/sell" element={<SellCar />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/chats" element={<ChatList />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
