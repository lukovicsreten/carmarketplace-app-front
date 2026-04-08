import heroImage from "@/assets/hero-car.jpg";
import { Search } from "lucide-react";

interface HeroProps {
  onSearch: (term: string) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
  return (
    <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
          Find Your Perfect Car
        </h1>
        <p className="text-xl text-primary-foreground/90 mb-8">
          Browse thousands of quality used cars from trusted sellers
        </p>
        
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by brand or model..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full px-6 py-4 pr-12 rounded-xl text-lg border-2 border-transparent focus:border-accent focus:outline-none shadow-2xl"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
