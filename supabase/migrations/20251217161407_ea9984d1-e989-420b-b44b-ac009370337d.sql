-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage bucket for banner images
INSERT INTO storage.buckets (id, name, public) VALUES ('banner-images', 'banner-images', true);

-- Storage policies for product images
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

-- Storage policies for banner images
CREATE POLICY "Anyone can view banner images" ON storage.objects
  FOR SELECT USING (bucket_id = 'banner-images');

CREATE POLICY "Admins can upload banner images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'banner-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update banner images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'banner-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete banner images" ON storage.objects
  FOR DELETE USING (bucket_id = 'banner-images' AND public.is_admin(auth.uid()));