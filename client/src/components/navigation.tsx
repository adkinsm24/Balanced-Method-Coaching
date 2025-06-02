import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
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
          
          <Link href="/online-training">
            <Button 
              variant={location === "/online-training" ? "default" : "ghost"}
              className={location === "/online-training" ? "bg-primary text-primary-foreground" : ""}
            >
              Online Training
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}