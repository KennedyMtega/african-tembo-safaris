
Goal: fix the broken admin login experience and make employee/admin account management reliable so this does not regress.

What I found (current root causes)
1. Role conflict in database for your own account:
   - `user_roles` currently has two rows for the same user (`admin` + `user`).
   - In `AuthContext.signIn()` and `fetchRole()`, role lookup uses `.single()`.
   - With multiple rows, `.single()` fails and the app falls back to `"user"`, so you get treated like a non-admin.

2. Admin access guard is too strict:
   - `AdminLayout` uses `isAdmin` only (`userRole === "admin"`), so `management` users are blocked from admin pages.
   - This breaks the intended “admin + employee access admin portal” behavior.

3. Navigation is being triggered during render:
   - `AdminLogin` does `navigate()` inline in render.
   - This causes React warnings and unstable redirects.

4. Role visibility via RLS is incomplete for staff:
   - `user_roles` policies only allow admin full management.
   - There is no explicit “read own role” policy, which can cause management role detection problems.

5. Role mutation flow is not hardened against duplicates:
   - Role updates currently use broad `update ... where user_id = ?` logic.
   - Combined with current schema (`UNIQUE(user_id, role)`), duplicate role states can persist and keep causing auth ambiguity.

Implementation plan (strict and permanent fix)

Phase 1 — Database/RLS hardening (single source of truth for role)
1. Add a migration to clean role data:
   - For any user with multiple role rows, keep exactly one “effective” role with precedence:
     `admin > management > user`.
   - Delete extra rows.

2. Enforce one role per user:
   - Add `UNIQUE(user_id)` on `public.user_roles`.
   - Remove/replace old `UNIQUE(user_id, role)` to prevent future duplicates.

3. Add safe role-read policy:
   - Add policy: authenticated users can `SELECT` their own role row (`user_id = auth.uid()`).
   - Keep admin manage-all policy unchanged.
   - Roles remain strictly in `user_roles` only (not profile/users tables).

4. Optional hardening function:
   - Add `public.get_my_role()` (security definer) returning one effective role.
   - This avoids client ambiguity forever and keeps role checks server-trustable.

Phase 2 — Auth context and routing fixes
1. `src/contexts/AuthContext.tsx`
   - Replace fragile `.single()` role fetch with deterministic logic:
     - either call `get_my_role()`, or
     - query role row with a deterministic fallback.
   - Add `isStaff = userRole === "admin" || userRole === "management"`.
   - Keep `isAdmin` for settings/destructive actions where needed.

2. `src/components/AdminLayout.tsx`
   - Guard with `isStaff` (not only `isAdmin`) so management enters admin portal.
   - Keep settings page itself admin-only at page/sidebar level.

3. `src/pages/admin/AdminLogin.tsx`
   - Remove `navigate()` call from render.
   - Use `useEffect` redirect after auth state resolves.
   - Route by role from sign-in result (`admin/management -> /admin/dashboard`).

4. `src/pages/auth/LoginPage.tsx`
   - Ensure same deterministic role routing as admin login.

5. `src/components/CustomerLayout.tsx`
   - Add strict redirect: if logged-in user is staff, send to `/admin/dashboard` so staff are never treated as customer in dashboard routes.

Phase 3 — Employee creation and role management reliability
1. `supabase/functions/create-employee/index.ts`
   - Keep admin-only server-side authorization check.
   - After creating user, set role via upsert/replace flow that guarantees exactly one role row.
   - Return clear errors on conflicts.

2. `src/services/userService.ts`
   - Update role mutation methods to align with one-row-per-user model:
     - `updateRole(userId, role)` = deterministic single-role change.
     - `removeRole(userId)` = set to `"user"` (not ambiguous updates).
   - Ensure employee listing reads only `admin/management` role rows.

3. `src/pages/admin/AdminSettings.tsx`
   - Keep Team Management UI, but wire actions to hardened role methods.
   - Improve feedback for creation/update failures (e.g., duplicate email, permission denied).

Phase 4 — Regression prevention and validation
1. Add a migration safety check query (or post-migration validation) to confirm:
   - no user has more than one role row.

2. Manual verification matrix (must pass):
   - Existing admin with prior duplicate roles can log in and lands on `/admin/dashboard`.
   - New management account can log in via `/admin` and access admin pages.
   - Management cannot access admin-only settings/destructive actions.
   - New admin can be created from Settings and log in immediately.
   - Staff user opening `/dashboard` is redirected to admin dashboard.

3. Confirm warnings are gone:
   - “Function components cannot be given refs” related to admin/login redirect flow should no longer appear from render-time navigation logic.

Technical notes
- Security model remains correct: role checks continue to be server-backed via Supabase Auth + RLS + `has_role`.
- No client-side role trust (no localStorage-based admin checks).
- Roles remain in `public.user_roles` only, as required.
- This plan directly addresses your current blocker and also closes the structural cause so it does not recur.
