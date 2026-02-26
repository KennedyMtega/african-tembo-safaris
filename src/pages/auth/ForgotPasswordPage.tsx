import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import temboLogo from "@/assets/tembo-logo.jpg";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) setError(error);
    else setSent(true);
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm border-border/50">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <img src={temboLogo} alt="Tembo" className="mx-auto h-14 w-14 rounded-full object-cover" />
            <h1 className="mt-3 font-display text-xl font-bold text-foreground">Reset Password</h1>
            <p className="text-sm text-muted-foreground">Enter your email to receive a reset link</p>
          </div>
          {sent ? (
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">Check your email for a reset link.</p>
              <Button asChild variant="outline" className="w-full"><Link to="/login">Back to Login</Link></Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</Button>
              <p className="text-center text-sm"><Link to="/login" className="text-primary hover:underline">Back to Login</Link></p>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
