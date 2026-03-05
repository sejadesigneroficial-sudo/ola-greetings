-- Fix RLS policies: Change public SELECT policies from RESTRICTIVE to PERMISSIVE
-- The issue is that RESTRICTIVE policies require ALL policies to pass
-- We need PERMISSIVE policies that allow access if ANY policy passes

-- Drop the conflicting RESTRICTIVE policies for products
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;

-- Create a single PERMISSIVE policy for public product viewing
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT
  USING (is_active = true OR is_admin(auth.uid()));

-- Drop the conflicting RESTRICTIVE policies for categories
DROP POLICY IF EXISTS "Admins can view all categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;

-- Create a single PERMISSIVE policy for public category viewing
CREATE POLICY "Public can view active categories" ON public.categories
  FOR SELECT
  USING (is_active = true OR is_admin(auth.uid()));

-- Drop the conflicting RESTRICTIVE policies for banners
DROP POLICY IF EXISTS "Admins can view all banners" ON public.banners;
DROP POLICY IF EXISTS "Anyone can view active banners" ON public.banners;

-- Create a single PERMISSIVE policy for public banner viewing
CREATE POLICY "Public can view active banners" ON public.banners
  FOR SELECT
  USING (is_active = true OR is_admin(auth.uid()));

-- Fix site_settings - should be publicly readable
DROP POLICY IF EXISTS "Admins can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;

-- Create public read policy for site_settings
CREATE POLICY "Public can view site settings" ON public.site_settings
  FOR SELECT
  USING (true);