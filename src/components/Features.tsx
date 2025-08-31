import { Shield, Search, MessageCircle, BarChart3, CreditCard, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      description: "All cars are verified by our expert team to ensure quality and authenticity"
    },
    {
      icon: Search,
      title: "Advanced Search",
      description: "Find exactly what you're looking for with our powerful filtering system"
    },
    {
      icon: MessageCircle,
      title: "Direct Chat",
      description: "Connect instantly with sellers and buyers through our secure chat system"
    },
    {
      icon: BarChart3,
      title: "Car Comparison",
      description: "Compare multiple vehicles side-by-side to make informed decisions"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Safe and secure payment processing for worry-free transactions"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Get help from our automotive experts throughout your buying journey"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose ArmenianCars?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide the most comprehensive and trusted platform for buying and selling cars in Armenia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-6 rounded-xl border border-border/50 bg-gradient-card hover:shadow-card transition-all duration-300 hover:border-primary/20"
            >
              <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;