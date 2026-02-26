import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import temboLogo from "@/assets/tembo-logo.jpg";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setError(error.message);
    else navigate("/login");
  };

  if (!ready) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm border-border/50">
          <CardContent className="p-6 text-center space-y-4">
            <h1 className="font-display text-xl font-bold text-foreground">Invalid Link</h1>
            <p className="text-sm text-muted-foreground">This password reset link is invalid or expired.</p>
            <Button asChild><Link to="/forgot-password">Request New Link</Link></Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm border-border/50">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <img src={temboLogo} alt="Tembo" className="mx-auto h-14 w-14 rounded-full object-cover" />
            <h1 className="mt-3 font-display text-xl font-bold text-foreground">Set New Password</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>New Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Updating..." : "Update Password"}</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
