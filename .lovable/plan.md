

# Fix Broken Images, Improve Booking Traveler Flow, Add 50% Deposit Requirement

## Three issues to address

### 1. Broken Unsplash Images (Ngorongoro + Kilimanjaro packages and destinations)

**Root cause:** Multiple Unsplash image URLs used in the seed data return 404. Confirmed broken:
- All 5 Ngorongoro package images
- Ngorongoro destination image
- At least 2 Kilimanjaro package images

**Fix:** 
- Update the broken image URLs in the database using SQL UPDATE statements (via the insert tool) with verified working Unsplash image URLs
- Add an `onError` fallback handler to all `<img>` tags across `PackageCard.tsx`, `PackageDetailPage.tsx`, and `BookingPage.tsx` so that broken images gracefully fall back to `/placeholder.svg` instead of showing a broken icon. This prevents future broken image issues regardless of the source.

### 2. Booking Flow — Traveler Email Flexibility + Note

**Current behavior:** Every traveler requires a unique email. The lead traveler (Traveler 1) must enter their email, then every additional traveler also requires an email.

**Changes to `BookingPage.tsx` Step 2:**
- For Traveler 1: Email remains required (this is the booking contact)
- For Travelers 2+: Add a "Use same email as lead traveler" checkbox that auto-fills the email from Traveler 1. Email field becomes optional for additional travelers.
- Add a well-written info note above the travelers section:
  > "Each traveler will receive personalized trip preparation details and itinerary information at their email address. If a fellow traveler doesn't have a separate email, you may use the lead traveler's email for their booking."
- Update `canProceedStep2` validation: only Traveler 1 requires email; others can be blank or filled

### 3. 50% Deposit Payment Requirement

**Changes to booking flow:**
- Add a new **Step 4: Payment** between Review and Confirmation (update `STEPS` array to `["Select", "Details", "Review", "Payment"]`)
- In Step 3 (Review), show the deposit amount prominently: "50% deposit required to secure your booking: $X,XXX"
- Step 4 (Payment) shows:
  - Deposit amount (50% of total)
  - Remaining balance and when it's due
  - A note: "A 50% deposit is required to secure your safari booking. The remaining balance is due 30 days before your departure date."
  - "Pay Deposit" button that creates the booking with `payment_status: 'partial'`
  - For now, since no payment gateway is integrated yet, the button will create the booking and show a confirmation page with payment instructions (bank transfer / follow-up). The system records the expected deposit amount.
- Add `deposit_amount` to the bookings table via migration
- Update `bookingService.create` to include `deposit_amount`
- Update `BookingConfirmation.tsx` to show deposit info and next steps

## Files Changed

| File | Change |
|------|--------|
| `src/components/PackageCard.tsx` | Add `onError` fallback to img |
| `src/pages/PackageDetailPage.tsx` | Add `onError` fallback to all img tags |
| `src/pages/BookingPage.tsx` | Traveler email flexibility, info note, 50% deposit step, updated steps array |
| `src/pages/BookingConfirmation.tsx` | Show deposit amount and payment instructions |
| `src/services/bookingService.ts` | Include deposit_amount in create |
| SQL migration | Add `deposit_amount` column to bookings |
| SQL data update | Fix broken Ngorongoro + Kilimanjaro image URLs in packages and destinations tables |

