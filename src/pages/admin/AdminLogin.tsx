import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import temboLogo from "@/assets/tembo-logo.jpg";

export default function AdminLogin() {
  const { signIn, isStaff, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already staff — in useEffect, not render
  useEffect(() => {
    if (!isLoading && isStaff) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isLoading, isStaff, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error, role } = await signIn(email, password);
    setLoading(false);
    if (error) setError(error);
    else if (role === "admin" || role === "management") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      setError("You do not have admin access.");
    }
  };

  // Don't render login form if already staff
  if (!isLoading && isStaff) return null;

  return (
    <section className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm border-border/50">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <img src={temboLogo} alt="Tembo" className="mx-auto h-14 w-14 rounded-full object-cover" />
            <h1 className="mt-3 font-display text-xl font-bold text-foreground">Admin Login</h1>
            <p className="text-sm text-muted-foreground">Sign in to manage your safaris</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
