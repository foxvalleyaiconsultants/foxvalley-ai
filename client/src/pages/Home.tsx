import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LogoCarousel from "@/components/LogoCarousel";
import { Lightbulb, Cog, Cpu, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: "url('/hero-bg.jpg')"}}></div>
        <div className="relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-primary leading-tight">
              AI Strategy, Automation,<br/>
              and AI Integration for<br/>
              Businesses
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your business with cutting-edge artificial intelligence solutions tailored to your unique needs.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-[0_0_20px_rgba(191,255,0,0.5)] hover:shadow-[0_0_30px_rgba(191,255,0,0.7)] transition-all">
                Schedule a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{backgroundImage: "url('/welcome-bg.jpg')"}}></div>
        <div className="relative z-10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-primary text-center mb-8">
            Welcome to Fox Valley AI Consultants
          </h2>
          <p className="text-lg text-foreground text-center max-w-4xl mx-auto leading-relaxed">
            We are a leading AI consulting firm specializing in technology strategy, business process automation, and custom AI solutions. Our team of experts works closely with businesses to identify opportunities, implement cutting-edge technologies, and drive measurable results. Whether you're looking to optimize operations, enhance decision-making with analytics, or build custom AI applications, we provide the expertise and support you need to succeed in the age of artificial intelligence.
          </p>
        </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Services Section */}
      <section className="py-20 px-6 bg-card/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{backgroundImage: "url('/services-bg.jpg')"}}></div>
        <div className="relative z-10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-primary text-center mb-16">
            Our Services
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card border-2 border-primary hover:shadow-[0_0_30px_rgba(191,255,0,0.3)] transition-all">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">AI Strategy Consulting</h3>
                <p className="text-foreground leading-relaxed">
                  Develop comprehensive AI strategies aligned with your business goals. We assess your current capabilities, identify opportunities, and create actionable roadmaps for AI adoption and integration.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-primary hover:shadow-[0_0_30px_rgba(191,255,0,0.3)] transition-all">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Cog className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Automation Implementation</h3>
                <p className="text-foreground leading-relaxed">
                  Streamline operations and reduce costs with intelligent automation. We design and implement automated workflows that enhance efficiency, minimize errors, and free your team to focus on high-value work.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-primary hover:shadow-[0_0_30px_rgba(191,255,0,0.3)] transition-all">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Custom AI Solutions</h3>
                <p className="text-foreground leading-relaxed">
                  Build bespoke AI applications tailored to your specific business challenges. From machine learning models to natural language processing, we develop solutions that deliver tangible business value.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-primary hover:shadow-[0_0_30px_rgba(191,255,0,0.3)] transition-all">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Analytics & Optimization</h3>
                <p className="text-foreground leading-relaxed">
                  Leverage data-driven insights to optimize performance and drive growth. Our analytics solutions help you understand patterns, predict trends, and make informed decisions with confidence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{backgroundImage: "url('/whychoose-bg.jpg')"}}></div>
        <div className="relative z-10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-primary text-center mb-16">
            Why Choose Fox Valley AI
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-4">01</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Deep Expertise</h3>
              <p className="text-muted-foreground">
                Our team brings years of experience in AI, machine learning, and enterprise technology implementation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-4">02</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Local Presence</h3>
              <p className="text-muted-foreground">
                Based in the Fox Valley region, we understand local business needs and provide hands-on support.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-4">03</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Results-Focused</h3>
              <p className="text-muted-foreground">
                We measure success by your success, delivering solutions that drive measurable business outcomes.
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-card/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{backgroundImage: "url('/testimonials-bg.jpg')"}}></div>
        <div className="relative z-10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-primary text-center mb-16">
            What Our Clients Say
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card border-2 border-primary">
              <CardContent className="p-8">
                <p className="text-foreground italic mb-6 leading-relaxed">
                  "Fox Valley AI transformed our operations with their automation solutions. We've seen a 40% reduction in processing time and our team can now focus on strategic initiatives."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">JD</span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Jennifer Davis</div>
                    <div className="text-sm text-muted-foreground">COO, TechManufacturing Inc.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-primary">
              <CardContent className="p-8">
                <p className="text-foreground italic mb-6 leading-relaxed">
                  "The AI strategy roadmap they developed gave us clarity and confidence. Their expertise helped us navigate complex decisions and implement solutions that truly deliver value."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">MR</span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Michael Rodriguez</div>
                    <div className="text-sm text-muted-foreground">VP of Technology, RetailCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-primary">
              <CardContent className="p-8">
                <p className="text-foreground italic mb-6 leading-relaxed">
                  "Working with Fox Valley AI was a game-changer. Their custom solution perfectly addressed our unique challenges and the ROI exceeded our expectations."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">SK</span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Sarah Kim</div>
                    <div className="text-sm text-muted-foreground">CEO, FinanceFirst Solutions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-primary">
              <CardContent className="p-8">
                <p className="text-foreground italic mb-6 leading-relaxed">
                  "Their analytics platform gave us insights we never had before. We're making better decisions faster, and our competitive advantage has never been stronger."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">DP</span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">David Patel</div>
                    <div className="text-sm text-muted-foreground">Director of Analytics, DataDriven Co.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let's discuss how AI can drive growth and innovation for your organization.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-[0_0_20px_rgba(191,255,0,0.5)] hover:shadow-[0_0_30px_rgba(191,255,0,0.7)] transition-all">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
