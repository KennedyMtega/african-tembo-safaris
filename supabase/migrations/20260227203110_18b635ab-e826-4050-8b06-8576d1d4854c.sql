
-- Phase 1: Deduplicate user_roles — keep highest-precedence role per user
-- Priority: admin > management > user
DELETE FROM public.user_roles a
USING public.user_roles b
WHERE a.user_id = b.user_id
  AND a.id <> b.id
  AND (
    (b.role = 'admin' AND a.role <> 'admin')
    OR (b.role = 'management' AND a.role = 'user')
  );

-- Drop old composite unique constraint if it exists
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;

-- Add strict one-role-per-user constraint
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);

-- Add RLS policy: users can read their own role
CREATE POLICY "Users read own role"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add management read-all policy for user_roles (so management can list team)
CREATE POLICY "Management reads roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'management'::app_role));

-- Create get_my_role() function — returns single deterministic role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1),
    'user'
  )
$$;
