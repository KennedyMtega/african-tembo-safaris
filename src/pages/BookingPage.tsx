import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Minus, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { BookingSteps } from "@/components/BookingSteps";
import { cn } from "@/lib/utils";
import { packageService } from "@/services/packageService";
import { bookingService } from "@/services/bookingService";
import { useAuth } from "@/contexts/AuthContext";
import type { Traveler } from "@/types";
import { useQuery } from "@tanstack/react-query";

const STEPS = ["Select", "Details", "Review", "Payment"];

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { data: pkg, isLoading } = useQuery({ queryKey: ["package", slug], queryFn: () => packageService.getBySlug(slug!) });

  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [numTravelers, setNumTravelers] = useState(1);
  const [travelers, setTravelers] = useState<Traveler[]>([{ firstName: "", lastName: "", email: "", phone: "" }]);
  const [useLeadEmail, setUseLeadEmail] = useState<boolean[]>([false]);
  const [specialRequests, setSpecialRequests] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) return <div className="container py-20 text-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!pkg) return <div className="container py-20 text-center"><h1 className="font-display text-2xl font-bold text-foreground">Package not found</h1><Button asChild className="mt-4"><Link to="/packages">Back to Packages</Link></Button></div>;

  const useGroupPrice = pkg.groupPriceMin && numTravelers >= 4;
  const pricePerPerson = useGroupPrice ? pkg.groupPriceMin! : pkg.priceMin;
  const totalPrice = pricePerPerson * numTravelers;
  const depositAmount = Math.ceil(totalPrice * 0.5);
  const remainingBalance = totalPrice - depositAmount;

  const updateTravelerCount = (n: number) => {
    const clamped = Math.max(1, Math.min(pkg.maxGroupSize, n));
    setNumTravelers(clamped);
    setTravelers((prev) => {
      if (clamped > prev.length) return [...prev, ...Array.from({ length: clamped - prev.length }, () => ({ firstName: "", lastName: "", email: "", phone: "" }))];
      return prev.slice(0, clamped);
    });
    setUseLeadEmail((prev) => {
      if (clamped > prev.length) return [...prev, ...Array.from({ length: clamped - prev.length }, () => false)];
      return prev.slice(0, clamped);
    });
  };

  const updateTraveler = (idx: number, field: keyof Traveler, value: string) => {
    setTravelers((prev) => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };

  const toggleUseLeadEmail = (idx: number, checked: boolean) => {
    setUseLeadEmail((prev) => prev.map((v, i) => i === idx ? checked : v));
    if (checked && travelers[0]?.email) {
      setTravelers((prev) => prev.map((t, i) => i === idx ? { ...t, email: travelers[0].email } : t));
    }
  };

  const canProceedStep1 = !!startDate;
  const canProceedStep2 = travelers[0]?.firstName && travelers[0]?.lastName && travelers[0]?.email &&
    travelers.every((t) => t.firstName && t.lastName);

  const handleProceedToStep3 = () => {
    if (!user) { setShowAuth(true); return; }
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

  // Fill empty emails with lead traveler email before submission
  const getFinalTravelers = (): Traveler[] => {
    const leadEmail = travelers[0]?.email || "";
    return travelers.map((t, i) => ({
      ...t,
      email: t.email || (i > 0 ? leadEmail : t.email),
    }));
  };

  const handleConfirm = async () => {
    if (!startDate || !user) return;
    setSubmitting(true);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + pkg.duration - 1);
    try {
      const booking = await bookingService.create({
        packageId: pkg.id,
        userId: user.id,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        travelers: getFinalTravelers(),
        totalAmount: totalPrice,
        depositAmount,
        specialRequests,
      });
      navigate(`/booking-confirmation/${booking.bookingRef}?deposit=${depositAmount}&total=${totalPrice}`);
    } catch (err: any) {
      console.error("Booking failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container max-w-3xl">
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Book: {pkg.title}</h1>
        <p className="mb-8 text-sm text-muted-foreground">{pkg.duration} days · {pkg.destination}</p>
        <div className="mb-8"><BookingSteps currentStep={step} steps={STEPS} /></div>

        {/* Step 1: Select dates & travelers */}
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
            <div className="rounded-md bg-secondary/50 p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{numTravelers} × ${pricePerPerson.toLocaleString()}</span><span className="font-semibold text-foreground">${totalPrice.toLocaleString()}</span></div>
              {useGroupPrice && <p className="text-xs text-safari-green font-medium">Group discount applied!</p>}
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-muted-foreground">50% deposit to secure booking</span>
                <span className="font-semibold text-primary">${depositAmount.toLocaleString()}</span>
              </div>
            </div>
            <Button className="w-full" disabled={!canProceedStep1} onClick={() => setStep(2)}>Continue</Button>
          </CardContent></Card>
        )}

        {/* Step 2: Traveler Details */}
        {step === 2 && (
          <Card><CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-3 rounded-md bg-accent/50 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                Each traveler will receive personalized trip preparation details and itinerary information at their email address. If a fellow traveler doesn't have a separate email, you may use the lead traveler's email for their communications.
              </p>
            </div>
            {travelers.map((t, idx) => (
              <div key={idx} className="space-y-3 rounded-md border border-border p-4">
                <h3 className="font-display text-sm font-semibold text-foreground">
                  Traveler {idx + 1} {idx === 0 && <span className="text-xs font-normal text-muted-foreground ml-1">(Lead Traveler)</span>}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><Label>First Name *</Label><Input value={t.firstName} onChange={(e) => updateTraveler(idx, "firstName", e.target.value)} /></div>
                  <div><Label>Last Name *</Label><Input value={t.lastName} onChange={(e) => updateTraveler(idx, "lastName", e.target.value)} /></div>
                  {idx === 0 ? (
                    <div><Label>Email *</Label><Input type="email" value={t.email} onChange={(e) => updateTraveler(idx, "email", e.target.value)} /></div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Email <span className="text-xs text-muted-foreground">(optional)</span></Label>
                      <div className="flex items-center gap-2 mb-1">
                        <Checkbox
                          id={`use-lead-${idx}`}
                          checked={useLeadEmail[idx] || false}
                          onCheckedChange={(checked) => toggleUseLeadEmail(idx, !!checked)}
                        />
                        <label htmlFor={`use-lead-${idx}`} className="text-xs text-muted-foreground cursor-pointer">
                          Use lead traveler's email
                        </label>
                      </div>
                      <Input
                        type="email"
                        value={useLeadEmail[idx] ? travelers[0]?.email || "" : t.email}
                        onChange={(e) => updateTraveler(idx, "email", e.target.value)}
                        disabled={useLeadEmail[idx]}
                        className={useLeadEmail[idx] ? "opacity-60" : ""}
                      />
                    </div>
                  )}
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

        {/* Step 3: Review */}
        {step === 3 && (
          <Card><CardContent className="p-6 space-y-6">
            <h2 className="font-display text-xl font-bold text-foreground">Booking Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Package</span><span className="text-foreground font-medium">{pkg.title}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Dates</span><span className="text-foreground">{startDate ? format(startDate, "PPP") : ""} ({pkg.duration} days)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Travelers</span><span className="text-foreground">{numTravelers}</span></div>
              <div className="flex justify-between border-t border-border pt-2"><span className="text-muted-foreground">Total Price</span><span className="font-semibold text-foreground">${totalPrice.toLocaleString()}</span></div>
              <div className="flex justify-between font-semibold"><span className="text-primary">50% Deposit Due Now</span><span className="text-primary">${depositAmount.toLocaleString()}</span></div>
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-sm font-semibold text-foreground">Travelers</h3>
              {travelers.map((t, i) => <p key={i} className="text-sm text-muted-foreground">{t.firstName} {t.lastName}{t.email ? ` — ${t.email}` : ""}</p>)}
            </div>
            {specialRequests && <div><h3 className="font-display text-sm font-semibold text-foreground">Special Requests</h3><p className="text-sm text-muted-foreground">{specialRequests}</p></div>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(4)}>Proceed to Payment</Button>
            </div>
          </CardContent></Card>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <Card><CardContent className="p-6 space-y-6">
            <h2 className="font-display text-xl font-bold text-foreground">Secure Your Booking</h2>
            <div className="rounded-md bg-accent/50 p-5 space-y-3">
              <p className="text-sm text-muted-foreground">
                A <strong className="text-foreground">50% deposit</strong> is required to secure your safari booking. The remaining balance is due <strong className="text-foreground">30 days before your departure date</strong>.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Trip Cost</span><span className="text-foreground font-medium">${totalPrice.toLocaleString()}</span></div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold"><span className="text-primary">Deposit Due Now (50%)</span><span className="text-primary">${depositAmount.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Remaining Balance (due 30 days before departure)</span><span className="text-foreground">${remainingBalance.toLocaleString()}</span></div>
            </div>
            <div className="rounded-md border border-border p-4 space-y-2">
              <h3 className="font-display text-sm font-semibold text-foreground">Payment Instructions</h3>
              <p className="text-sm text-muted-foreground">
                After confirming, our team will reach out with secure payment options including bank transfer and card payment. Your booking will be held for 48 hours while we process your deposit.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button className="flex-1" onClick={handleConfirm} disabled={submitting}>
                {submitting ? "Processing..." : `Confirm & Pay Deposit — $${depositAmount.toLocaleString()}`}
              </Button>
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
