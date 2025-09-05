import { Search, Menu, User, Heart, MessageCircle, Car, ArrowLeftRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">AC</span>
              </div>
              <span className="text-xl font-bold text-primary">StartDrive</span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search cars, brands, models..." 
                className="pl-10 pr-4 bg-background text-foreground placeholder:text-muted-foreground border-border"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden sm:flex lg:flex items-center space-x-3 lg:space-x-6">
            <Link to="/buy" className="text-foreground hover:text-primary transition-colors text-sm lg:text-base">Buy</Link>
            <Link to="/sell" className="text-foreground hover:text-primary transition-colors text-sm lg:text-base">Sell</Link>
            <Link to="/compare" className="text-foreground hover:text-primary transition-colors text-sm lg:text-base">Compare</Link>
            <Link to="/chats" className="text-foreground hover:text-primary transition-colors text-sm lg:text-base">Chat</Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="icon" className="flex">
              <Link to="/favorites">
                <Heart className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex">
              <Link to="/profile" className="inline-flex items-center">
                <User className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </Button>
            <Button asChild variant="accent" size="sm" className="flex">
              <Link to="/sell">
                <span className="hidden sm:inline">Sell Car</span>
                <span className="sm:hidden">Sell</span>
              </Link>
            </Button>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="sm:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-6">
                  <Link 
                    to="/" 
                    className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="w-5 h-5" />
                    Home
                  </Link>
                  <Link 
                    to="/buy" 
                    className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Car className="w-5 h-5" />
                    Buy Cars
                  </Link>
                  <Link 
                    to="/sell" 
                    className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Car className="w-5 h-5" />
                    Sell Car
                  </Link>
                  <Link 
                    to="/compare" 
                    className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ArrowLeftRight className="w-5 h-5" />
                    Compare
                  </Link>
            <Link 
              to="/chats" 
              className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageCircle className="w-5 h-5" />
              Chats
            </Link>
                  <Link 
                    to="/favorites" 
                    className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="w-5 h-5" />
                    Favorites
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search cars, brands, models..." 
              className="pl-10 pr-4 bg-background text-foreground placeholder:text-muted-foreground border-border" 
            />
          </div>
        </div>
      </div>
    </header>;
};
export default Header;