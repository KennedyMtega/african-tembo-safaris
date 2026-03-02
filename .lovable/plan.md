

# Fix Button Contrast Issue in Hero Section

## Problem
The "Plan My Trip" button in the hero section uses `border-primary-foreground/30` (30% opacity border) and no visible background, making it nearly invisible against the dark overlay until the user hovers over it.

## Solution
Increase the border opacity and add a subtle semi-transparent background so the button is clearly visible at rest, not just on hover.

## Technical Changes

**File: `src/pages/HomePage.tsx` (line 55)**

Change the "Plan My Trip" button classes from:
```
border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10
```
To:
```
border-primary-foreground/70 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20
```

This gives the button:
- A clearly visible border (70% opacity instead of 30%)
- A subtle frosted background at rest (10% opacity fill)
- A slightly stronger background on hover (20%)
- Consistent contrast with the "Explore Safaris" button next to it
