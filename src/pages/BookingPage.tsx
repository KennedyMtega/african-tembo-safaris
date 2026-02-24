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
import { BookingSteps } from "@/components/BookingSteps";
import { cn } from "@/lib/utils";
import { mockPackages } from "@/data/mockData";
import { bookingService } from "@/services/bookingService";
import type { Traveler } from "@/types";

const STEPS = ["Select", "Details", "Review"];

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const pkg = mockPackages.find((p) => p.slug === slug);

  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [numTravelers, setNumTravelers] = useState(1);
  const [travelers, setTravelers] = useState<Traveler[]>([{ firstName: "", lastName: "", email: "", phone: "" }]);
  const [specialRequests, setSpecialRequests] = useState("");

  if (!pkg) return <div className="container py-20 text-center"><h1 className="font-display text-2xl font-bold text-foreground">Package not found</h1><Button asChild className="mt-4"><Link to="/packages">Back to Packages</Link></Button></div>;

  const useGroupPrice = pkg.groupPrice && numTravelers >= 4;
  const pricePerPerson = useGroupPrice ? pkg.groupPrice! : pkg.price;
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

  const handleConfirm = async () => {
    if (!startDate) return;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + pkg.duration - 1);
    const booking = await bookingService.create({
      packageId: pkg.id,
      packageTitle: pkg.title,
      userId: "guest",
      status: "pending",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      travelers,
      totalAmount: totalPrice,
      paymentStatus: "pending",
      specialRequests,
    });
    navigate(`/booking-confirmation/${booking.bookingRef}`);
  };

  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container max-w-3xl">
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Book: {pkg.title}</h1>
        <p className="mb-8 text-sm text-muted-foreground">{pkg.duration} days · {pkg.destination}</p>
        <div className="mb-8"><BookingSteps currentStep={step} steps={STEPS} /></div>

        {/* Step 1 */}
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

        {/* Step 2 */}
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
              <Button className="flex-1" disabled={!canProceedStep2} onClick={() => setStep(3)}>Continue</Button>
            </div>
          </CardContent></Card>
        )}

        {/* Step 3 */}
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
    </section>
  );
}
