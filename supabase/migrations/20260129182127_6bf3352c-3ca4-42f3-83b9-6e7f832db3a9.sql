-- Create storage bucket for APK files
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-downloads', 'app-downloads', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the bucket
CREATE POLICY "Anyone can download APK files"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-downloads');

CREATE POLICY "Admin users can upload APK files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'app-downloads' 
  AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admin users can update APK files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'app-downloads' 
  AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admin users can delete APK files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'app-downloads' 
  AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Create table to track current APK version
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  apk_url TEXT,
  apk_version TEXT,
  apk_filename TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read app settings
CREATE POLICY "Anyone can view app settings"
ON public.app_settings FOR SELECT
USING (true);

-- Only admins can update app settings
CREATE POLICY "Admins can update app settings"
ON public.app_settings FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can insert app settings"
ON public.app_settings FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Insert default row
INSERT INTO public.app_settings (id) VALUES (gen_random_uuid());