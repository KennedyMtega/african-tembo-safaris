import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookingSteps } from "@/components/BookingSteps";
import { cn } from "@/lib/utils";
import { packageService } from "@/services/packageService";
import { bookingService } from "@/services/bookingService";
import { useAuth } from "@/contexts/AuthContext";
import type { Traveler } from "@/types";
import { useQuery } from "@tanstack/react-query";

const STEPS = ["Select", "Details", "Review"];

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { data: pkg, isLoading } = useQuery({ queryKey: ["package", slug], queryFn: () => packageService.getBySlug(slug!) });

  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [numTravelers, setNumTravelers] = useState(1);
  const [travelers, setTravelers] = useState<Traveler[]>([{ firstName: "", lastName: "", email: "", phone: "" }]);
  const [specialRequests, setSpecialRequests] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  if (isLoading) return <div className="container py-20 text-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!pkg) return <div className="container py-20 text-center"><h1 className="font-display text-2xl font-bold text-foreground">Package not found</h1><Button asChild className="mt-4"><Link to="/packages">Back to Packages</Link></Button></div>;

  const useGroupPrice = pkg.groupPriceMin && numTravelers >= 4;
  const pricePerPerson = useGroupPrice ? pkg.groupPriceMin! : pkg.priceMin;
  const totalPrice = pricePerPerson * numTravelers;

  const updateTravelerCount = (n: number) => {
    const clamped = Math.max(1, Math.min(pkg.maxGroupSize, n));
    setNumTravelers(clamped);
    setTravelers((prev) => {
      if (clamped > prev.length) return [...prev, ...Array.from({ length: clamped - prev.length }, () => ({ firstName: "", lastName: "", email: "", phone: "" }))];
      return prev.slice(0, clamped);
    });
  };

  const updateTraveler = (idx: number, field: keyof Traveler, value: string) => {
    setTravelers((prev) => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };

  const canProceedStep1 = !!startDate;
  const canProceedStep2 = travelers.every((t) => t.firstName && t.lastName && t.email);

  const handleProceedToStep3 = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setStep(3);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    if (authMode === "login") {
      const { error } = await signIn(authEmail, authPassword);
      if (error) { setAuthError(error); setAuthLoading(false); return; }
    } else {
      const { error } = await signUp(authEmail, authPassword, authName);
      if (error) { setAuthError(error); setAuthLoading(false); return; }
    }
    setAuthLoading(false);
    setShowAuth(false);
    setStep(3);
  };

  const handleConfirm = async () => {
    if (!startDate || !user) return;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + pkg.duration - 1);
    try {
      const booking = await bookingService.create({
        packageId: pkg.id,
        userId: user.id,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        travelers,
        totalAmount: totalPrice,
        specialRequests,
      });
      navigate(`/booking-confirmation/${booking.bookingRef}`);
    } catch (err: any) {
      console.error("Booking failed:", err);
    }
  };

  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container max-w-3xl">
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Book: {pkg.title}</h1>
        <p className="mb-8 text-sm text-muted-foreground">{pkg.duration} days · {pkg.destination}</p>
        <div className="mb-8"><BookingSteps currentStep={step} steps={STEPS} /></div>

        {step === 1 && (
          <Card><CardContent className="p-6 space-y-6">
            <div>
              <Label className="mb-2 block">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} disabled={(d) => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="mb-2 block">Number of Travelers</Label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => updateTravelerCount(numTravelers - 1)}><Minus className="h-4 w-4" /></Button>
                <span className="w-8 text-center font-semibold text-foreground">{numTravelers}</span>
                <Button variant="outline" size="icon" onClick={() => updateTravelerCount(numTravelers + 1)}><Plus className="h-4 w-4" /></Button>
                <span className="text-sm text-muted-foreground">(max {pkg.maxGroupSize})</span>
              </div>
            </div>
            <div className="rounded-md bg-secondary/50 p-4">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{numTravelers} × ${pricePerPerson.toLocaleString()}</span><span className="font-semibold text-foreground">${totalPrice.toLocaleString()}</span></div>
              {useGroupPrice && <p className="mt-1 text-xs text-safari-green font-medium">Group discount applied!</p>}
            </div>
            <Button className="w-full" disabled={!canProceedStep1} onClick={() => setStep(2)}>Continue</Button>
          </CardContent></Card>
        )}

        {step === 2 && (
          <Card><CardContent className="p-6 space-y-6">
            {travelers.map((t, idx) => (
              <div key={idx} className="space-y-3 rounded-md border border-border p-4">
                <h3 className="font-display text-sm font-semibold text-foreground">Traveler {idx + 1}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><Label>First Name *</Label><Input value={t.firstName} onChange={(e) => updateTraveler(idx, "firstName", e.target.value)} /></div>
                  <div><Label>Last Name *</Label><Input value={t.lastName} onChange={(e) => updateTraveler(idx, "lastName", e.target.value)} /></div>
                  <div><Label>Email *</Label><Input type="email" value={t.email} onChange={(e) => updateTraveler(idx, "email", e.target.value)} /></div>
                  <div><Label>Phone</Label><Input type="tel" value={t.phone} onChange={(e) => updateTraveler(idx, "phone", e.target.value)} /></div>
                  <div className="sm:col-span-2"><Label>Dietary Needs</Label><Input value={t.dietaryNeeds ?? ""} onChange={(e) => updateTraveler(idx, "dietaryNeeds", e.target.value)} /></div>
                </div>
              </div>
            ))}
            <div><Label>Special Requests</Label><Textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Any special requirements..." /></div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" disabled={!canProceedStep2} onClick={handleProceedToStep3}>Continue</Button>
            </div>
          </CardContent></Card>
        )}

        {step === 3 && (
          <Card><CardContent className="p-6 space-y-6">
            <h2 className="font-display text-xl font-bold text-foreground">Booking Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Package</span><span className="text-foreground font-medium">{pkg.title}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Dates</span><span className="text-foreground">{startDate ? format(startDate, "PPP") : ""} ({pkg.duration} days)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Travelers</span><span className="text-foreground">{numTravelers}</span></div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold"><span>Total</span><span className="text-primary">${totalPrice.toLocaleString()}</span></div>
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-sm font-semibold text-foreground">Travelers</h3>
              {travelers.map((t, i) => <p key={i} className="text-sm text-muted-foreground">{t.firstName} {t.lastName} — {t.email}</p>)}
            </div>
            {specialRequests && <div><h3 className="font-display text-sm font-semibold text-foreground">Special Requests</h3><p className="text-sm text-muted-foreground">{specialRequests}</p></div>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={handleConfirm}>Confirm Booking</Button>
            </div>
          </CardContent></Card>
        )}
      </div>

      {/* Auth Modal */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">{authMode === "login" ? "Sign In" : "Create Account"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "signup" && (
              <div><Label>Full Name</Label><Input value={authName} onChange={(e) => setAuthName(e.target.value)} required /></div>
            )}
            <div><Label>Email</Label><Input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required /></div>
            <div><Label>Password</Label><Input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required minLength={6} /></div>
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? "Please wait..." : authMode === "login" ? "Sign In" : "Sign Up"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {authMode === "login" ? (
                <>Don't have an account? <button type="button" className="text-primary hover:underline" onClick={() => setAuthMode("signup")}>Sign up</button></>
              ) : (
                <>Already have an account? <button type="button" className="text-primary hover:underline" onClick={() => setAuthMode("login")}>Sign in</button></>
              )}
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
