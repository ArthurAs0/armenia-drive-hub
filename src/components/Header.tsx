import { Search, Menu, User, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
const Header = () => {
  return <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">AC</span>
            </div>
            <span className="text-xl font-bold text-primary">StartDrive</span>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search cars, brands, models..." className="pl-10 pr-4 bg-background/50 border-border focus:bg-background" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/buy" className="text-foreground hover:text-primary transition-colors">Buy</Link>
            <Link to="/sell" className="text-foreground hover:text-primary transition-colors">Sell</Link>
            <Link to="/compare" className="text-foreground hover:text-primary transition-colors">Compare</Link>
            <Link to="/chat" className="text-foreground hover:text-primary transition-colors">Chat</Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            
            
            <Button asChild variant="ghost" size="icon" className="hidden sm:flex">
              <Link to="/favorites">
                <Heart className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="hidden sm:flex">
              <Link to="/profile" className="inline-flex items-center">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </Button>
            <Button asChild variant="accent" size="sm">
              <Link to="/sell">
                Sell Car
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search cars, brands, models..." className="pl-10 pr-4 bg-background/50 border-border" />
          </div>
        </div>
      </div>
    </header>;
};
export default Header;