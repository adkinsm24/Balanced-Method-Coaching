import { Link } from "wouter";
import SocialMedia from "@/components/social-media";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Coach Mark</h3>
            <p className="text-secondary-foreground/80 leading-relaxed">
              Helping people find sustainable ways of eating that lead to lasting fat loss and better health. No cookie-cutter solutions, just proven strategies that work.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/coaching-offers" className="text-secondary-foreground/80 hover:text-primary transition-colors">Coaching Offers</Link>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Coach Mark</h4>
            <p className="text-secondary-foreground/80 mb-4">
              Stay connected for fitness tips, nutrition advice, and motivation
            </p>
            <SocialMedia variant="footer" />
          </div>
        </div>
        
        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-secondary-foreground/60">
            © 2024 Coach Mark. All rights reserved. | Precision Nutrition Certified Coach
          </p>
        </div>
      </div>
    </footer>
  );
}