import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const Footer = () => {
  return <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">SD
              </span>
              </div>
              <span className="text-xl font-bold">StartDrive
            </span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Armenia's most trusted platform for buying and selling quality vehicles. 
              Connecting buyers and sellers across the country.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Buy Cars</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Sell Your Car</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Car Comparison</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Financing</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Insurance</a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Help Center</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Contact Us</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Terms of Service</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Safety Tips</a>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Connected</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <Phone className="w-4 h-4" />
                <span>+374 10 123456</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                <span>info@armeniancars.am</span>
              </div>
              <div className="flex items-start space-x-2 text-primary-foreground/80">
                <MapPin className="w-4 h-4 mt-1" />
                <span>Yerevan, Armenia</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-primary-foreground/80">Subscribe to our newsletter</p>
              <div className="flex space-x-2">
                <Input placeholder="Your email" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60" />
                <Button variant="accent" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2024 ArmenianCars. All rights reserved. Made with ❤️ in Armenia.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;