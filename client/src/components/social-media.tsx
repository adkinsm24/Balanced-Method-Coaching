import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

interface SocialMediaProps {
  variant?: "default" | "footer" | "floating";
  className?: string;
}

export default function SocialMedia({ variant = "default", className = "" }: SocialMediaProps) {
  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/coachmark",
      color: "hover:text-blue-600"
    },
    {
      name: "Instagram", 
      icon: Instagram,
      url: "https://instagram.com/coachmark",
      color: "hover:text-pink-600"
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/coachmark",
      color: "hover:text-blue-400"
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/@coachmark",
      color: "hover:text-red-600"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/coachmark",
      color: "hover:text-blue-700"
    }
  ];

  const baseStyles = "transition-all duration-300 transform hover:scale-110";
  
  const variantStyles = {
    default: "flex space-x-4 justify-center",
    footer: "flex space-x-6 justify-center text-white",
    floating: "fixed right-6 bottom-6 flex flex-col space-y-3 z-40"
  };

  const iconStyles = {
    default: `${baseStyles} text-gray-600 hover:text-primary`,
    footer: `${baseStyles} text-white hover:text-primary`,
    floating: `${baseStyles} bg-white text-gray-600 hover:text-primary shadow-lg rounded-full p-3`
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      {/* Social media links removed */}
    </div>
  );
}