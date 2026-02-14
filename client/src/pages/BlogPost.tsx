import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-4xl text-center text-muted-foreground">
            Loading...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Post Not Found</h1>
            <Link href="/blog">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
          </Link>

          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded mb-4">
              {post.category}
            </span>
            <h1 className="text-5xl font-bold text-primary mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </div>
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <Streamdown>{post.content}</Streamdown>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
