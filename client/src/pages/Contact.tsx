import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Phone, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    message: "",
  });

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", website: "", message: "" });
    },
    onError: (error) => {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{backgroundImage: "url('/whychoose-bg.jpg')"}}></div>
        <div className="relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-primary mb-4">
              Get in Touch with Fox Valley AI Consultants
            </h1>
            <p className="text-xl text-muted-foreground">
              Ready to transform your business with AI? Let's start the conversation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-card border-2 border-primary">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-2 bg-input border-border text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-foreground">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-2 bg-input border-border text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-foreground">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-2 bg-input border-border text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-foreground">Website (Optional)</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourcompany.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="mt-2 bg-input border-border text-foreground"
                    />
                  </div>

                  <div className="flex-1">
                    <Label htmlFor="message" className="text-foreground">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project and how we can help..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={20}
                      className="mt-2 bg-input border-border text-foreground resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(191,255,0,0.5)] hover:shadow-[0_0_30px_rgba(191,255,0,0.7)] transition-all"
                  >
                    {submitMutation.isPending ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-6">
                  Contact Information
                </h2>
                <p className="text-muted-foreground mb-8">
                  Reach out to us directly or fill out the form. We typically respond within 24 hours.
                </p>
              </div>

              <Card className="bg-card border-2 border-primary">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <a href="mailto:contact@foxvalleyaiconsultants.com" className="text-foreground font-semibold hover:text-primary">
                        contact@foxvalleyaiconsultants.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-2 border-primary">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <a href="tel:+19204126216" className="text-foreground font-semibold hover:text-primary">
                        (920) 412-6216
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-2 border-primary">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Schedule a Consultation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Book a free 30-minute consultation to discuss your AI strategy and explore how we can help transform your business.
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(191,255,0,0.5)] hover:shadow-[0_0_30px_rgba(191,255,0,0.7)] transition-all">
                    Book Consultation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
