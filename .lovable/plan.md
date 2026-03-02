
# Fix Navbar: Reduce Header Clutter

## Problem
The desktop navbar is too wide with 7 nav links + notification bell + user account dropdown + "Book Now" button, causing overflow on medium screens.

## Solution
1. **Remove the standalone "Book Now" button** -- it duplicates the "Packages" link. Instead, make the "Packages" link text say "Book Safari" so it serves both purposes with a clear CTA feel.
2. **Move "FAQ" out of the main nav** -- FAQ is a support page better accessed from the footer (where it already exists). This drops the nav from 7 items to 6.
3. **Tighten nav link padding** -- reduce horizontal padding from `px-3` to `px-2.5` for a slightly more compact feel.
4. **Keep mobile menu unchanged** -- the mobile hamburger menu will retain all links including FAQ and Book Now since space isn't an issue there.

### Result
Desktop nav goes from: `Home | Packages | Destinations | Gallery | About | Contact | FAQ [bell] [avatar] [Book Now]`
To: `Home | Book Safari | Destinations | Gallery | About | Contact [bell] [avatar]`

This removes 2 items from the right side and keeps the header clean and professional.

## Technical Changes

**File: `src/components/Navbar.tsx`**
- Remove "FAQ" from the `navLinks` array (keep it in mobile menu only)
- Rename "Packages" label to "Book Safari" for CTA intent
- Remove the `<Button asChild className="hidden md:inline-flex">Book Now</Button>` block
- Slightly reduce nav link padding
