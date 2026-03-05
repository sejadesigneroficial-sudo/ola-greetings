import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface Product {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  category: string | null;
  location: string | null;
  current_bid: number;
  starting_bid: number;
  bid_increment: number;
  opening_date: string | null;
  closing_date: string | null;
  serial_number: string | null;
  manufacturer: string | null;
  model: string | null;
  year: number | null;
  hour_meter: string | null;
  lot_number: string | null;
  views: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  is_active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  highlight_text: string | null;
  cta_text: string;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
}

export interface SiteSettings {
  id: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  social_media: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  homepage: {
    metaTitle?: string;
    metaDescription?: string;
    ctaTitle?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
    feature1Title?: string;
    feature1Description?: string;
    feature2Title?: string;
    feature2Description?: string;
    feature3Title?: string;
    feature3Description?: string;
  };
  leiloes_page: {
    title?: string;
    description?: string;
    metaDescription?: string;
  };
  footer: {
    brandDescription?: string;
    copyrightText?: string;
  };
  edital: Record<string, any>;
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export interface Profile {
  id: string;
  user_id: string | null;
  email: string;
  name: string;
  phone: string | null;
  cpf: string | null;
  status: 'active' | 'blocked';
  created_at: string;
}

// Hook to fetch products
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, refetch: fetchProducts };
}

// Hook to fetch categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setCategories(data as Category[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, refetch: fetchCategories };
}

// Hook to fetch banners
export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order');
    
    if (!error && data) {
      setBanners(data as Banner[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return { banners, loading, refetch: fetchBanners };
}

// Hook to fetch site settings
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    
    if (!error && data) {
      setSettings(data as unknown as SiteSettings);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, refetch: fetchSettings };
}

// Hook to fetch profiles (users)
export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProfiles(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return { profiles, loading, refetch: fetchProfiles };
}
