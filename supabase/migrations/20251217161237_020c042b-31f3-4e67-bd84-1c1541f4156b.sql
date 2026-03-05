-- Create enum for user status
CREATE TYPE public.user_status AS ENUM ('active', 'blocked');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  cpf TEXT,
  status user_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'Package',
  color TEXT DEFAULT '#f97316',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT,
  location TEXT,
  current_bid NUMERIC DEFAULT 0,
  starting_bid NUMERIC DEFAULT 0,
  bid_increment NUMERIC DEFAULT 100,
  opening_date TIMESTAMP WITH TIME ZONE,
  closing_date TIMESTAMP WITH TIME ZONE,
  serial_number TEXT,
  manufacturer TEXT,
  model TEXT,
  year INTEGER,
  hour_meter TEXT,
  lot_number TEXT,
  views INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create banners table
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  highlight_text TEXT,
  cta_text TEXT DEFAULT 'Ver Leilões',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create site_settings table (single row for global settings)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT DEFAULT '(47) 3311-0550',
  whatsapp TEXT DEFAULT '5547999999999',
  email TEXT DEFAULT 'contato@agrolance.com.br',
  address TEXT DEFAULT 'Rua Example, 123 - Cidade, Estado',
  social_media JSONB DEFAULT '{"facebook": "", "instagram": "", "youtube": "", "linkedin": ""}',
  homepage JSONB DEFAULT '{"metaTitle": "AgroLance Leilões", "metaDescription": "", "ctaTitle": "", "ctaDescription": "", "ctaButtonText": ""}',
  leiloes_page JSONB DEFAULT '{"title": "Leilões", "description": "", "metaDescription": ""}',
  footer JSONB DEFAULT '{"brandDescription": "", "copyrightText": ""}',
  edital JSONB DEFAULT '{}',
  colors JSONB DEFAULT '{"primary": "#f97316", "secondary": "#1a1a1a", "accent": "#22c55e"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create arremates (won auctions) table
CREATE TABLE public.arremates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_title TEXT NOT NULL,
  final_value NUMERIC NOT NULL,
  date_won TIMESTAMP WITH TIME ZONE DEFAULT now(),
  documentation_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin_users table for admin panel access
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arremates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
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

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all categories" ON public.categories
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all products" ON public.products
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for banners (public read active, admin write)
CREATE POLICY "Anyone can view active banners" ON public.banners
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all banners" ON public.banners
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert banners" ON public.banners
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update banners" ON public.banners
  FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete banners" ON public.banners
  FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for site_settings (public read, admin write)
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert site settings" ON public.site_settings
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for arremates
CREATE POLICY "Users can view their own arremates" ON public.arremates
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all arremates" ON public.arremates
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert arremates" ON public.arremates
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update arremates" ON public.arremates
  FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete arremates" ON public.arremates
  FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage admin users" ON public.admin_users
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name, phone, cpf)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'cpf', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers for all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (
  phone, whatsapp, email, address,
  social_media, homepage, leiloes_page, footer, edital, colors
) VALUES (
  '(47) 3311-0550',
  '5547999999999',
  'contato@agrolance.com.br',
  'Rua Example, 123 - Cidade, Estado',
  '{"facebook": "", "instagram": "", "youtube": "", "linkedin": ""}',
  '{"metaTitle": "AgroLance Leilões - Leilões de Máquinas Agrícolas", "metaDescription": "Encontre as melhores ofertas em máquinas agrícolas", "ctaTitle": "Pronto para Encontrar sua Máquina?", "ctaDescription": "Cadastre-se agora e participe dos melhores leilões de máquinas agrícolas do Brasil", "ctaButtonText": "Cadastre-se Gratuitamente"}',
  '{"title": "Leilões", "description": "Confira todos os leilões disponíveis", "metaDescription": "Leilões de máquinas agrícolas"}',
  '{"brandDescription": "Plataforma líder em leilões de máquinas agrícolas", "copyrightText": "© 2024 AgroLance Leilões. Todos os direitos reservados."}',
  '{}',
  '{"primary": "#f97316", "secondary": "#1a1a1a", "accent": "#22c55e"}'
);