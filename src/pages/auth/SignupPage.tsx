import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import temboLogo from "@/assets/tembo-logo.jpg";

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) setError(error);
    else setSuccess(true);
  };

  if (success) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm border-border/50">
          <CardContent className="p-6 space-y-4 text-center">
            <img src={temboLogo} alt="Tembo" className="mx-auto h-14 w-14 rounded-full object-cover" />
            <h1 className="font-display text-xl font-bold text-foreground">Check Your Email</h1>
            <p className="text-sm text-muted-foreground">We sent a confirmation link to <strong>{email}</strong>. Please verify your email to continue.</p>
            <Button asChild variant="outline" className="w-full"><Link to="/login">Back to Login</Link></Button>
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
            <h1 className="mt-3 font-display text-xl font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground">Start planning your safari adventure</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account..." : "Sign Up"}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
