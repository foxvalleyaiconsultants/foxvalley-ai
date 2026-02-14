import { useState } from "react";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { Menu, X, Shield } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
              <img src="/logo.png" alt="Fox Valley AI" className="h-14 w-auto" />
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="/blog" className="text-foreground hover:text-primary transition-colors font-medium">
              Blog
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-6 pb-4 flex flex-col gap-4 border-t border-border pt-4">
            <Link 
              href="/" 
              className="text-foreground hover:text-primary transition-colors font-medium text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className="text-foreground hover:text-primary transition-colors font-medium text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              className="text-foreground hover:text-primary transition-colors font-medium text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                className="text-primary hover:text-primary/80 transition-colors font-medium text-lg inline-flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="w-5 h-5" />
                Admin Dashboard
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
