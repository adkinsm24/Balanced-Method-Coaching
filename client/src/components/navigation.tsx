import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-50/95 via-red-50/95 to-pink-50/95 backdrop-blur-sm shadow-lg border-b border-orange-200/30">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-secondary">Coach Mark</h1>
        </Link>
        
        <div className="flex space-x-4">
          <Link href="/">
            <Button 
              variant={location === "/" ? "default" : "ghost"}
              className={location === "/" ? "bg-primary text-primary-foreground" : ""}
            >
              Home
            </Button>
          </Link>
          
          <Link href="/about">
            <Button 
              variant={location === "/about" ? "default" : "ghost"}
              className={location === "/about" ? "bg-primary text-primary-foreground" : ""}
            >
              About Me
            </Button>
          </Link>
          
          <Link href="/coaching-offers">
            <Button 
              variant={location === "/coaching-offers" ? "default" : "ghost"}
              className={location === "/coaching-offers" ? "bg-primary text-primary-foreground" : ""}
            >Coaching Offers</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}