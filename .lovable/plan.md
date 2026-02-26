

# Destinations Enhancement + Role-Based Employee Management

## Overview

Three major improvements:
1. **Destination image uploads** -- replace URL input with file upload to Supabase Storage
2. **Destination detail view** -- show packages linked to each destination
3. **Employee management in Settings** -- create staff accounts with "admin" (full access) or "management" (edit/create only, no delete) roles

---

## 1. Storage Bucket for Destination Images

**Migration**: Create a `destination-images` storage bucket (public) with RLS policies allowing admin uploads and public reads.

```text
storage.buckets: destination-images (public)
RLS on storage.objects:
  - Public SELECT for destination-images bucket
  - Admin INSERT/UPDATE/DELETE for destination-images bucket
```

---

## 2. Add "management" Role to Database

**Migration**: Alter the `app_role` enum to add `management` value. Update the `has_role` function and add RLS policies so management users can access admin-level SELECT and INSERT/UPDATE but NOT DELETE on key tables (packages, bookings, destinations, reviews, inquiries).

```text
ALTER TYPE public.app_role ADD VALUE 'management';
```

New RLS policies on each managed table:
- Management can SELECT (same as admin)
- Management can INSERT and UPDATE (same as admin)
- Management CANNOT DELETE (only admin can)

The existing "Admin manages X" ALL policies will be split into separate SELECT/INSERT/UPDATE/DELETE policies so we can grant management users granular access.

---

## 3. Updated Files

### `src/services/destinationService.ts`
- Add `uploadImage(file: File)` method that uploads to `destination-images` bucket and returns the public URL
- Update `create()` and `update()` to accept the public URL from uploaded images

### `src/pages/admin/AdminDestinations.tsx`
- Replace the "Image URL" text input with a file upload input (`<input type="file" accept="image/*">`)
- Show image preview before saving
- On submit, upload the file via `destinationService.uploadImage()`, then save the destination with the returned URL
- Add a "View Packages" expand/click that shows packages linked to each destination (query packages by `destination_id`)
- Each destination card shows its linked packages count (already exists) plus a clickable area to see the package list

### `src/pages/admin/AdminSettings.tsx`
- Add a new "Team Management" card section
- Shows a table of current employees (users with admin or management roles)
- "Invite Employee" dialog with fields: Email, Password, Full Name, Role (admin / management)
- Uses an Edge Function to create the user (since client-side `signUp` can't assign roles server-side)
- Each employee row has a role badge and actions: change role, remove access (set back to user)

### `supabase/functions/create-employee/index.ts` (new Edge Function)
- Accepts POST `{ email, password, fullName, role }` where role is "admin" or "management"
- Uses `supabase.auth.admin.createUser()` with service role key to create the account (no email confirmation needed)
- Inserts the role into `user_roles`
- Only callable by existing admins (JWT validated, caller must have admin role)

### `src/services/userService.ts`
- Add `createEmployee(email, password, fullName, role)` -- invokes the `create-employee` edge function
- Add `updateRole(userId, role)` -- updates `user_roles` table
- Add `removeRole(userId)` -- deletes from `user_roles` (reverts to basic user)

### `src/contexts/AuthContext.tsx`
- Add `userRole` state (string: "admin" | "management" | "user") alongside `isAdmin`
- Fetch actual role from `user_roles` table
- Export `userRole` so the sidebar/UI can conditionally show/hide delete buttons

### `src/components/AdminSidebar.tsx`
- Show "Settings" link only for admin role (not management)
- Show the actual role label (admin/management) under the user name

### `src/pages/admin/AdminPackages.tsx`, `AdminBookings.tsx`, `AdminDestinations.tsx`, etc.
- Hide delete buttons when `userRole === "management"` (they can still create and edit)

### `supabase/config.toml`
- Add `create-employee` function config with `verify_jwt = false` (validated in code)

---

## Technical Notes

- The `app_role` enum currently has `admin`, `moderator`, `user`. We will use `management` instead of `moderator` (or reuse `moderator` if preferred -- using the new value is cleaner).
- The Edge Function for employee creation uses `supabase.auth.admin.createUser()` which requires the service role key (already in secrets).
- Management role grants read + create + edit access across the admin panel but blocks destructive actions (delete). Settings page is admin-only.
- Destination images are uploaded to `destination-images` bucket with a unique filename (UUID-based) to avoid collisions.

