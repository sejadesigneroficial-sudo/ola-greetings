import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from './AuthContext';

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
  year: number | null;
  hour_meter: string | null;
  lot_number: string | null;
  quilometragem: string | null;
  views: number;
  is_featured: boolean;
  is_active: boolean;
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
  financing_link: string;
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
    siteTitle?: string;
    slogan?: string;
  };
  leiloes_page: {
    title?: string;
    description?: string;
    metaDescription?: string;
  };
  footer: {
    brandDescription?: string;
    copyrightText?: string;
    copyright?: string;
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

export interface Arremate {
  id: string;
  user_id: string;
  product_title: string;
  final_value: number;
  date_won: string;
  documentation_url: string | null;
}

interface DataContextType {
  // Data
  products: Product[];
  categories: Category[];
  banners: Banner[];
  siteSettings: SiteSettings | null;
  profiles: Profile[];
  favorites: string[];
  arremates: Arremate[];
  loading: boolean;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  incrementProductViews: (id: string) => Promise<void>;
  
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Banner actions
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<void>;
  updateBanner: (id: string, data: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  
  // Settings actions
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  
  // Profile actions
  updateProfile: (id: string, data: Partial<Profile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  
  // Arremates actions (admin)
  getAllArremates: () => Arremate[];
  getArrematsByUserId: (userId: string) => Arremate[];
  
  // Favorites actions
  addFavorite: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  
  // Arremates actions
  addArremate: (userId: string, data: Omit<Arremate, 'id' | 'user_id'>) => Promise<void>;
  deleteArremate: (id: string) => Promise<void>;
  
  // Refresh
  refreshData: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  id: '',
  phone: '(21) 97965-4426',
  whatsapp: '5521979654426',
  email: 'contato@agrolance.com.br',
  financing_link: 'https://financiamento-bv.lovable.app/simular-agora',
  address: 'São Paulo, SP - Brasil',
  social_media: { facebook: '', instagram: '', youtube: '', linkedin: '' },
  homepage: {
    metaTitle: 'Arremate 24 Horas',
    metaDescription: '',
    ctaTitle: 'Pronto para encontrar seu próximo carro ou moto?',
    ctaDescription: 'Junte-se a milhares de compradores',
    ctaButtonText: 'Criar Minha Conta',
  },
  leiloes_page: { title: 'Leilões', description: '', metaDescription: '' },
  footer: { brandDescription: '', copyrightText: '' },
  edital: {},
  colors: { primary: '#f97316', secondary: '#1a1a1a', accent: '#22c55e' },
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuthContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [arremates, setArremates] = useState<Arremate[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Fetch all data
  const fetchData = useCallback(async () => {
    // Only show loading on initial load, not on subsequent refreshes
    if (!initialLoadDone) {
      setLoading(true);
    }
    
    // Fetch products
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (productsData) setProducts(productsData as Product[]);
    
    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (categoriesData) setCategories(categoriesData as Category[]);
    
    // Fetch banners
    const { data: bannersData } = await supabase
      .from('banners')
      .select('*')
      .order('display_order');
    if (bannersData) setBanners(bannersData as Banner[]);
    
    // Fetch site settings
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (settingsData) {
      // Patch phone/whatsapp if still showing old numbers
      const oldNumbers = ['(15) 981896623', '(47) 3311-0550', '5547999999999', '15981896623'];
      const needsPatch =
        oldNumbers.some(n => settingsData.phone === n || settingsData.whatsapp === n);
      if (needsPatch) {
        await supabase
          .from('site_settings')
          .update({ phone: '(21) 97965-4426', whatsapp: '5521979654426' })
          .eq('id', settingsData.id);
        settingsData.phone = '(21) 97965-4426';
        settingsData.whatsapp = '5521979654426';
      }
      setSiteSettings(settingsData as unknown as SiteSettings);
    } else {
      setSiteSettings(defaultSettings);
    }
    
    // Fetch profiles if admin (exclude admin users, show only clients)
    if (isAdmin) {
      // First get admin user_ids
      const { data: adminUsersData } = await supabase
        .from('admin_users')
        .select('user_id');
      
      const adminUserIds = adminUsersData?.map(a => a.user_id) || [];
      
      // Fetch profiles excluding admins
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesData) {
        // Filter out admin profiles
        const clientProfiles = profilesData.filter(
          profile => profile.user_id && !adminUserIds.includes(profile.user_id)
        );
        setProfiles(clientProfiles as Profile[]);
      }
    }
    
    // Fetch user favorites
    if (user) {
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);
      if (favoritesData) {
        setFavorites(favoritesData.map(f => f.product_id));
      }
      
      // Fetch user arremates (for regular users)
      if (!isAdmin) {
        const { data: arrematesData } = await supabase
          .from('arremates')
          .select('*')
          .eq('user_id', user.id);
        if (arrematesData) setArremates(arrematesData as Arremate[]);
      }
    }
    
    // Admin fetches all arremates
    if (isAdmin) {
      const { data: arrematesData } = await supabase
        .from('arremates')
        .select('*')
        .order('created_at', { ascending: false });
      if (arrematesData) setArremates(arrematesData as Arremate[]);
    }
    
    setLoading(false);
    setInitialLoadDone(true);
  }, [user, isAdmin, initialLoadDone]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time subscription: keep products state in sync with DB changes
  useEffect(() => {
    const channel = supabase
      .channel('products:all')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => {
          const updated = payload.new as Product;
          setProducts((prev) =>
            prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
          );
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'products' },
        (payload) => {
          const inserted = payload.new as Product;
          setProducts((prev) => [inserted, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'products' },
        (payload) => {
          const deleted = payload.old as { id: string };
          setProducts((prev) => prev.filter((p) => p.id !== deleted.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Product actions
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const { error } = await supabase.from('products').insert([product]);
    if (!error) await fetchData();
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    const { error } = await supabase.from('products').update(data).eq('id', id);
    if (!error) await fetchData();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) await fetchData();
  };

  const getProductById = (id: string) => products.find(p => p.id === id);

  const incrementProductViews = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      await supabase.from('products').update({ views: (product.views || 0) + 1 }).eq('id', id);
    }
  };

  // Category actions
  const addCategory = async (category: Omit<Category, 'id'>) => {
    const { error } = await supabase.from('categories').insert([category]);
    if (!error) await fetchData();
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    const { error } = await supabase.from('categories').update(data).eq('id', id);
    if (!error) await fetchData();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) await fetchData();
  };

  // Banner actions
  const addBanner = async (banner: Omit<Banner, 'id'>) => {
    const { error } = await supabase.from('banners').insert([banner]);
    if (!error) await fetchData();
  };

  const updateBanner = async (id: string, data: Partial<Banner>) => {
    const { error } = await supabase.from('banners').update(data).eq('id', id);
    if (!error) await fetchData();
  };

  const deleteBanner = async (id: string) => {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (!error) await fetchData();
  };

  // Settings actions
  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    if (siteSettings?.id) {
      const { error } = await supabase
        .from('site_settings')
        .update(settings as any)
        .eq('id', siteSettings.id);
      if (!error) await fetchData();
    }
  };

  // Profile actions
  const updateProfile = async (id: string, data: Partial<Profile>) => {
    const { error } = await supabase.from('profiles').update(data as any).eq('id', id);
    if (!error) await fetchData();
  };

  const deleteProfile = async (id: string) => {
    // First delete related arremates and favorites
    const profile = profiles.find(p => p.id === id);
    if (profile?.user_id) {
      await supabase.from('arremates').delete().eq('user_id', profile.user_id);
      await supabase.from('favorites').delete().eq('user_id', profile.user_id);
    }
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) await fetchData();
  };

  // Arremates helper functions
  const getAllArremates = () => arremates;
  const getArrematsByUserId = (userId: string) => arremates.filter(a => a.user_id === userId);

  // Favorites actions
  const addFavorite = async (productId: string) => {
    if (!user) return;
    const { error } = await supabase.from('favorites').insert([{ user_id: user.id, product_id: productId }]);
    if (!error) setFavorites(prev => [...prev, productId]);
  };

  const removeFavorite = async (productId: string) => {
    if (!user) return;
    const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', productId);
    if (!error) setFavorites(prev => prev.filter(id => id !== productId));
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Arremates actions
  const addArremate = async (userId: string, data: Omit<Arremate, 'id' | 'user_id'>) => {
    const { error } = await supabase.from('arremates').insert([{ ...data, user_id: userId }]);
    if (!error) await fetchData();
  };

  const deleteArremate = async (id: string) => {
    const { error } = await supabase.from('arremates').delete().eq('id', id);
    if (!error) await fetchData();
  };

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        banners,
        siteSettings,
        profiles,
        favorites,
        arremates,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        incrementProductViews,
        addCategory,
        updateCategory,
        deleteCategory,
        addBanner,
        updateBanner,
        deleteBanner,
        updateSiteSettings,
        updateProfile,
        deleteProfile,
        getAllArremates,
        getArrematsByUserId,
        addFavorite,
        removeFavorite,
        isFavorite,
        addArremate,
        deleteArremate,
        refreshData: fetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
