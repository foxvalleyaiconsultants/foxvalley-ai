// ============================================================
// FILE: client/src/pages/Login.tsx (NEW FILE)
// Standalone login page with username/password form.
// Also handles first-time admin registration.
// ============================================================

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Invalidate the auth query to refresh user state
      await utils.auth.me.invalidate();
      // Redirect to admin dashboard
      setLocation("/admin");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Invalidate the auth query to refresh user state
      await utils.auth.me.invalidate();
      // Redirect to admin dashboard
      setLocation("/admin");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          {/* Card container */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="/logo.png"
                alt="Fox Valley AI"
                className="h-16 w-auto"
              />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center mb-2">
              {isRegister ? "Create Admin Account" : "Admin Login"}
            </h1>
            <p className="text-muted-foreground text-center mb-6 text-sm">
              {isRegister
                ? "Set up your admin account to manage the website."
                : "Sign in to access the admin dashboard."}
            </p>

            {/* Error message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Login Form */}
            {!isRegister && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Username
                  </label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-background border-border"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            )}

            {/* Register Form */}
            {isRegister && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Email (optional)
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Username
                  </label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a password (min 8 chars)"
                    required
                    minLength={8}
                    className="bg-background border-border"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Admin Account"}
                </Button>
              </form>
            )}

            {/* Toggle between login and register */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="text-primary hover:text-primary/80 text-sm underline"
              >
                {isRegister
                  ? "Already have an account? Sign in"
                  : "First time? Create admin account"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
