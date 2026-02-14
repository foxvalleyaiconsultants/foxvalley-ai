import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Globe } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function NewsletterTab() {
  const { data: signups } = trpc.newsletter.list.useQuery();

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscribers ({signups?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {signups && signups.length > 0 ? (
            <div className="space-y-2">
              {signups.map((signup) => (
                <div key={signup.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{signup.email}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(signup.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No newsletter subscribers yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SocialLinksTab() {
  const [editingLink, setEditingLink] = useState<any>(null);
  const [linkForm, setLinkForm] = useState({ platform: "", url: "" });
  const { data: socialLinks, refetch } = trpc.socialLinks.list.useQuery();
  const upsertMutation = trpc.socialLinks.upsert.useMutation({
    onSuccess: () => {
      toast.success("Social link updated successfully!");
      setEditingLink(null);
      setLinkForm({ platform: "", url: "" });
      refetch();
    },
  });

  const platforms = ["Facebook", "X", "YouTube", "Instagram"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate({
      platform: linkForm.platform,
      url: linkForm.url,
      isActive: 1,
    });
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Social Media Links</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <select
                id="platform"
                value={linkForm.platform}
                onChange={(e) => setLinkForm({ ...linkForm, platform: e.target.value })}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                required
              >
                <option value="">Select platform</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={linkForm.url}
                onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>
            <Button type="submit" disabled={upsertMutation.isPending}>
              {upsertMutation.isPending ? "Saving..." : "Save Link"}
            </Button>
          </form>

          <div className="space-y-2">
            <h3 className="font-semibold mb-2">Current Links</h3>
            {socialLinks && socialLinks.length > 0 ? (
              socialLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="font-medium">{link.platform}:</span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {link.url}
                    </a>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLinkForm({ platform: link.platform, url: link.url })}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No social links configured yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "",
    readTime: 5,
  });

  const { data: posts, refetch: refetchPosts } = trpc.blog.list.useQuery();
  const { data: messages, refetch: refetchMessages } = trpc.contact.listMessages.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const createBlogMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully!");
      setShowBlogDialog(false);
      setBlogForm({ title: "", slug: "", content: "", excerpt: "", category: "", readTime: 5 });
      refetchPosts();
    },
    onError: (error) => {
      toast.error("Failed to create blog post: " + error.message);
    },
  });

  const updateBlogMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully!");
      setShowBlogDialog(false);
      setEditingPost(null);
      setBlogForm({ title: "", slug: "", content: "", excerpt: "", category: "", readTime: 5 });
      refetchPosts();
    },
    onError: (error) => {
      toast.error("Failed to update blog post: " + error.message);
    },
  });

  const deleteBlogMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted successfully!");
      refetchPosts();
    },
    onError: (error) => {
      toast.error("Failed to delete blog post: " + error.message);
    },
  });

  const markAsReadMutation = trpc.contact.markAsRead.useMutation({
    onSuccess: () => {
      toast.success("Message marked as read");
      refetchMessages();
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Admin Access Required</h1>
            <p className="text-muted-foreground mb-6">Please log in to access the admin dashboard.</p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href={getLoginUrl()}>Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You do not have admin privileges.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmitBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      updateBlogMutation.mutate({
        id: editingPost.id,
        ...blogForm,
        publishedAt: new Date(),
      });
    } else {
      createBlogMutation.mutate({
        ...blogForm,
        publishedAt: new Date(),
      });
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setBlogForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      readTime: post.readTime,
    });
    setShowBlogDialog(true);
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setBlogForm({ title: "", slug: "", content: "", excerpt: "", category: "", readTime: 5 });
    setShowBlogDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage blog posts and contact messages</p>
        </div>

        <Tabs defaultValue="blog" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="messages">Contact Messages</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <div className="mb-6">
              <Dialog open={showBlogDialog} onOpenChange={setShowBlogDialog}>
                <DialogTrigger asChild>
                  <Button onClick={handleNewPost} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    New Blog Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingPost ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitBlog} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={blogForm.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          // Auto-generate slug from title when creating new post (not editing)
                          const slug = !editingPost
                            ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                            : blogForm.slug;
                          setBlogForm({ ...blogForm, title, slug });
                        }}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug (URL-friendly) — auto-generated from title</Label>
                      <Input
                        id="slug"
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content (Markdown supported)</Label>
                      <Textarea
                        id="content"
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        rows={10}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="readTime">Read Time (minutes)</Label>
                      <Input
                        id="readTime"
                        type="number"
                        value={blogForm.readTime}
                        onChange={(e) => setBlogForm({ ...blogForm, readTime: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        {editingPost ? "Update Post" : "Create Post"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowBlogDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <Card key={post.id} className="border-2 border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
                              {post.category}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">{post.title}</h3>
                          <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPost(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this post?")) {
                                deleteBlogMutation.mutate({ id: post.id });
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No blog posts yet. Create your first post!
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="grid gap-4">
              {messages && messages.length > 0 ? (
                messages.map((message) => (
                  <Card key={message.id} className={`border-2 ${message.isRead ? 'border-border' : 'border-primary/50'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{message.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {message.email}
                            </div>
                            {message.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {message.phone}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                            </div>
                          </div>
                          {message.website && (
                            <div className="text-sm text-muted-foreground mt-2">
                              Website: <a href={message.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{message.website}</a>
                            </div>
                          )}
                        </div>
                        {!message.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsReadMutation.mutate({ id: message.id })}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-primary mt-1" />
                          <p className="text-foreground">{message.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No contact messages yet.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="newsletter">
            <NewsletterTab />
          </TabsContent>

          <TabsContent value="social">
            <SocialLinksTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
