-- Allow first admin to be inserted without existing admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = _user_id
  )
$$;

-- Policy to allow inserting first admin when no admins exist
CREATE POLICY "Allow first admin insert" ON public.admin_users
  FOR INSERT WITH CHECK (
    (SELECT COUNT(*) FROM public.admin_users) = 0
    OR public.is_admin(auth.uid())
  );