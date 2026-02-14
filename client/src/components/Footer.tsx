import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Facebook, Youtube, Instagram } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const newsletterSignup = trpc.newsletter.signup.useMutation();
  const { data: socialLinks } = trpc.socialLinks.list.useQuery();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await newsletterSignup.mutateAsync({ email });
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error: any) {
      if (error.message.includes("already subscribed")) {
        toast.error("This email is already subscribed");
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="w-6 h-6" />;
      case "x":
      case "twitter":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case "youtube":
        return <Youtube className="w-6 h-6" />;
      case "instagram":
        return <Instagram className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const activeSocialLinks = socialLinks?.filter(link => link.isActive === 1) || [];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Newsletter Signup */}
          <div className="w-full max-w-md">
            <h3 className="text-lg font-semibold text-center mb-4">Subscribe to Our Newsletter</h3>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-2 border-primary focus:border-primary focus-visible:ring-primary"
                required
              />
              <Button type="submit" disabled={newsletterSignup.isPending}>
                {newsletterSignup.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.png" alt="Fox Valley AI" className="h-12 w-auto" />
          </div>

          {/* Social Media Icons */}
          {activeSocialLinks.length > 0 && (
            <div className="flex items-center gap-6">
              {activeSocialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          )}

          {/* Copyright */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              © 2026 Fox Valley AI Consultants. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              AI Strategy, Automation, and AI Integration for Businesses
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
