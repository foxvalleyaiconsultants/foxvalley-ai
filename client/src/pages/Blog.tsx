import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{backgroundImage: "url('/services-bg.jpg')"}}></div>
        <div className="relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-primary mb-4">
              AI Insights & Updates
            </h1>
            <p className="text-xl text-muted-foreground">
              Weekly articles on AI strategy, automation, and digital transformation for businesses.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading posts...</div>
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="bg-card border-2 border-primary hover:shadow-[0_0_30px_rgba(191,255,0,0.3)] transition-all">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime} min read
                      </div>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-2">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">No blog posts yet.</div>
          )}

          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Want to Stay Updated?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Get in touch to discuss how AI can transform your business.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 shadow-[0_0_20px_rgba(191,255,0,0.5)] hover:shadow-[0_0_30px_rgba(191,255,0,0.7)] transition-all">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
