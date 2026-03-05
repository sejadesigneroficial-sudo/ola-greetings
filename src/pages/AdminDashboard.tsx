import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuthContext } from "@/contexts/AuthContext";
import { useData, Product, Category, Banner, SiteSettings, Profile, Arremate } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogOut, Plus, Pencil, Trash2, Package, Settings, Home, X, Users, Image, LayoutGrid, BarChart3, Globe, FileText, Save, Loader2, Eye, Ban, UserCheck, Trophy, Download, CalendarIcon, RefreshCw, Clock, Receipt, CreditCard, Percent, Smartphone, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { ApkUploadSection } from "@/components/admin/ApkUploadSection";
import { CreateUserDialog } from "@/components/admin/CreateUserDialog";
import { PaymentContractDialog } from "@/components/admin/PaymentContractDialog";
import { InvoiceSection } from "@/components/admin/InvoiceSection";

const iconOptions = ["Tractor", "Wheat", "Cog", "Truck", "Droplets", "Zap", "Package"];

export default function AdminDashboard() {
  const { user, isAdmin, signOut, loading: authLoading } = useAuthContext();
  const { 
    products, siteSettings, profiles, banners, categories, loading,
    addProduct, updateProduct, deleteProduct, updateSiteSettings,
    addBanner, updateBanner, deleteBanner, addCategory, updateCategory, deleteCategory, 
    refreshData, updateProfile, deleteProfile, addArremate, deleteArremate, getArrematsByUserId
  } = useData();
  const navigate = useNavigate();

  // Product form state
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: "", description: "", images: [], category: "", location: "",
    current_bid: 0, starting_bid: 0, bid_increment: 100, lot_number: "",
    year: undefined, views: 0, serial_number: "", hour_meter: "",
    quilometragem: "", opening_date: null, closing_date: null,
    is_featured: false, is_active: true
  });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  // Banner form state
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({
    title: "", subtitle: "", highlight_text: "", cta_text: "VER LOTES", image_url: "", is_active: true, display_order: 0
  });
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);

  // Category form state
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({
    name: "", description: "", icon: "Package", color: "#f97316", is_active: true
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);

  // User management state
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [arremateForm, setArremateForm] = useState({
    product_title: '',
    final_value: 0,
    documentation_url: ''
  });

  // Create user dialog state
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);

  // Payment contract dialogs state
  const [payEntregaDialogOpen, setPayEntregaDialogOpen] = useState(false);
  const [pay30DialogOpen, setPay30DialogOpen] = useState(false);

  useEffect(() => {
    if (siteSettings) setSettingsForm(siteSettings);
  }, [siteSettings]);

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin");
    }
  }, [user, isAdmin, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const handleLogout = async () => {
    await signOut();
    toast.success("Logout realizado!");
    navigate("/admin");
  };

  // Product handlers
  const resetProductForm = () => {
    setProductForm({
      title: "", description: "", images: [], category: "", location: "",
      current_bid: 0, starting_bid: 0, bid_increment: 100, lot_number: "",
      year: undefined, views: 0, serial_number: "", hour_meter: "",
      quilometragem: "", opening_date: null, closing_date: null,
      is_featured: false, is_active: true
    });
    setNewImageUrl("");
    setEditingProductId(null);
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setProductForm({ ...productForm, images: [...(productForm.images || []), newImageUrl] });
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    const images = (productForm.images || []).filter((_, i) => i !== index);
    setProductForm({ ...productForm, images });
  };

  const handleProductSubmit = async () => {
    if (!productForm.title || !productForm.location) {
      toast.error("Preencha título e localização");
      return;
    }
    if (editingProductId) {
      await updateProduct(editingProductId, productForm);
      toast.success("Produto atualizado!");
    } else {
      await addProduct(productForm as Omit<Product, 'id'>);
      toast.success("Produto adicionado!");
    }
    resetProductForm();
    setIsProductDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setProductForm(product);
    setEditingProductId(product.id);
    setIsProductDialogOpen(true);
  };

  // Banner handlers
  const resetBannerForm = () => {
    setBannerForm({ title: "", subtitle: "", highlight_text: "", cta_text: "VER LOTES", image_url: "", is_active: true, display_order: 0 });
    setEditingBannerId(null);
  };

  const handleBannerSubmit = async () => {
    if (!bannerForm.title) { toast.error("Título obrigatório"); return; }
    if (editingBannerId) {
      await updateBanner(editingBannerId, bannerForm);
      toast.success("Banner atualizado!");
    } else {
      await addBanner(bannerForm as Omit<Banner, 'id'>);
      toast.success("Banner adicionado!");
    }
    resetBannerForm();
    setIsBannerDialogOpen(false);
  };

  const handleEditBanner = (banner: Banner) => {
    setBannerForm(banner);
    setEditingBannerId(banner.id);
    setIsBannerDialogOpen(true);
  };

  // Category handlers
  const resetCategoryForm = () => {
    setCategoryForm({ name: "", description: "", icon: "Package", color: "#f97316", is_active: true });
    setEditingCategoryId(null);
  };

  const handleCategorySubmit = async () => {
    if (!categoryForm.name) { toast.error("Nome obrigatório"); return; }
    if (editingCategoryId) {
      await updateCategory(editingCategoryId, categoryForm);
      toast.success("Categoria atualizada!");
    } else {
      await addCategory(categoryForm as Omit<Category, 'id'>);
      toast.success("Categoria adicionada!");
    }
    resetCategoryForm();
    setIsCategoryDialogOpen(false);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryForm(category);
    setEditingCategoryId(category.id);
    setIsCategoryDialogOpen(true);
  };

  // Settings handler
  const handleSaveSettings = async () => {
    if (settingsForm) {
      await updateSiteSettings(settingsForm);
      toast.success("Configurações salvas!");
    }
  };

  // User management handlers
  const handleToggleUserStatus = async (profile: Profile) => {
    const newStatus = profile.status === 'active' ? 'blocked' : 'active';
    await updateProfile(profile.id, { status: newStatus });
    toast.success(newStatus === 'active' ? 'Usuário desbloqueado!' : 'Usuário bloqueado!');
  };

  const handleDeleteUser = async (profile: Profile) => {
    await deleteProfile(profile.id);
    toast.success('Usuário excluído!');
  };

  const handleOpenUserArremates = (profile: Profile) => {
    setSelectedUser(profile);
    setArremateForm({ product_title: '', final_value: 0, documentation_url: '' });
    setIsUserDialogOpen(true);
  };

  const handleAddArremate = async () => {
    if (!selectedUser?.user_id || !arremateForm.product_title) {
      toast.error('Preencha o título do produto');
      return;
    }
    await addArremate(selectedUser.user_id, {
      product_title: arremateForm.product_title,
      final_value: arremateForm.final_value,
      date_won: new Date().toISOString(),
      documentation_url: arremateForm.documentation_url || null
    });
    setArremateForm({ product_title: '', final_value: 0, documentation_url: '' });
    toast.success('Arremate adicionado!');
  };

  const handleDeleteArremate = async (id: string) => {
    await deleteArremate(id);
    toast.success('Arremate removido!');
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <>
      <Helmet><title>Dashboard Admin | AgroLance</title></Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="AgroLance" className="h-10" />
              <span className="text-white/70 text-sm">Painel Admin</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white" asChild>
                <Link to="/"><Home className="w-4 h-4 mr-2" />Ver Site</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-white border-white/20 hover:bg-white/10">
                <LogOut className="w-4 h-4 mr-2" />Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="flex flex-wrap gap-1 h-auto p-1">
              <TabsTrigger value="dashboard" className="gap-1 text-xs"><BarChart3 className="w-4 h-4" />Dashboard</TabsTrigger>
              <TabsTrigger value="products" className="gap-1 text-xs"><Package className="w-4 h-4" />Produtos</TabsTrigger>
              <TabsTrigger value="banners" className="gap-1 text-xs"><Image className="w-4 h-4" />Banners</TabsTrigger>
              <TabsTrigger value="categories" className="gap-1 text-xs"><LayoutGrid className="w-4 h-4" />Categorias</TabsTrigger>
              <TabsTrigger value="users" className="gap-1 text-xs"><Users className="w-4 h-4" />Usuários</TabsTrigger>
              <TabsTrigger value="financeiro" className="gap-1 text-xs"><Receipt className="w-4 h-4" />Financeiro</TabsTrigger>
              <TabsTrigger value="app" className="gap-1 text-xs"><Smartphone className="w-4 h-4" />Aplicativo</TabsTrigger>
              <TabsTrigger value="settings" className="gap-1 text-xs"><Settings className="w-4 h-4" />Configurações</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <h2 className="text-2xl font-display font-bold">Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-[5px] flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div><p className="text-xs text-muted-foreground">Produtos</p><p className="text-2xl font-bold">{products.length}</p></div>
                  </div>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-[5px] flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div><p className="text-xs text-muted-foreground">Usuários</p><p className="text-2xl font-bold">{profiles.length}</p></div>
                  </div>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-[5px] flex items-center justify-center">
                      <LayoutGrid className="w-5 h-5 text-success" />
                    </div>
                    <div><p className="text-xs text-muted-foreground">Categorias</p><p className="text-2xl font-bold">{categories.length}</p></div>
                  </div>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-[5px] flex items-center justify-center">
                      <Image className="w-5 h-5 text-gold" />
                    </div>
                    <div><p className="text-xs text-muted-foreground">Banners</p><p className="text-2xl font-bold">{banners.length}</p></div>
                  </div>
                </CardContent></Card>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Produtos</h2>
                <Button onClick={() => { resetProductForm(); setIsProductDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />Novo Produto
                </Button>
              </div>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagem</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Lance Atual</TableHead>
                      <TableHead>Tempo Restante</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const displayBid = (product.current_bid && product.current_bid > 0) ? product.current_bid : (product.starting_bid || 0);
                      const closingDate = product.closing_date ? new Date(product.closing_date) : null;
                      const now = new Date();
                      const isExpired = closingDate ? closingDate < now : false;
                      
                      const getTimeRemaining = () => {
                        if (!closingDate) return "Não definido";
                        if (isExpired) return null;
                        
                        const diff = closingDate.getTime() - now.getTime();
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                        const minutes = Math.floor((diff / 1000 / 60) % 60);
                        
                        if (days > 0) return `${days}d ${hours}h`;
                        if (hours > 0) return `${hours}h ${minutes}m`;
                        return `${minutes}m`;
                      };

                      const handleRenewProduct = async () => {
                        const newClosingDate = new Date();
                        newClosingDate.setDate(newClosingDate.getDate() + 3);
                        await updateProduct(product.id, { closing_date: newClosingDate.toISOString() });
                        toast.success("Produto renovado por mais 3 dias!");
                      };

                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img src={product.images?.[0] || '/placeholder.svg'} alt="" className="w-12 h-12 object-cover rounded" />
                          </TableCell>
                          <TableCell className="font-medium">{product.title}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="font-semibold text-accent">{formatCurrency(displayBid)}</TableCell>
                          <TableCell>
                            {isExpired ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleRenewProduct}
                                className="gap-1 text-primary hover:text-primary"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Renovar
                              </Button>
                            ) : (
                              <div className="flex items-center gap-1 text-sm">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span>{getTimeRemaining()}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${product.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                              {product.is_active ? 'Ativo' : 'Inativo'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}><Pencil className="w-4 h-4" /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Excluir produto?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => { deleteProduct(product.id); toast.success("Produto excluído!"); }}>Excluir</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Banners Tab */}
            <TabsContent value="banners" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Banners</h2>
                <Button onClick={() => { resetBannerForm(); setIsBannerDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />Novo Banner
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {banners.map((banner) => (
                  <Card key={banner.id}>
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {banner.image_url && <img src={banner.image_url} alt="" className="w-full h-full object-cover" />}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded text-xs ${banner.is_active ? 'bg-success text-white' : 'bg-muted-foreground text-white'}`}>
                          {banner.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{banner.title}</h3>
                      <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => handleEditBanner(banner)}><Pencil className="w-4 h-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="outline" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Excluir banner?</AlertDialogTitle></AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { deleteBanner(banner.id); toast.success("Banner excluído!"); }}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Categorias</h2>
                <Button onClick={() => { resetCategoryForm(); setIsCategoryDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />Nova Categoria
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: category.color }}>
                          <Package className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${category.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                          {category.is_active ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}><Pencil className="w-4 h-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="outline" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Excluir categoria?</AlertDialogTitle></AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { deleteCategory(category.id); toast.success("Categoria excluída!"); }}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Usuários</h2>
                <Button onClick={() => setIsCreateUserDialogOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />Novo Usuário
                </Button>
              </div>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.name}</TableCell>
                        <TableCell>{profile.email}</TableCell>
                        <TableCell>{profile.phone || '-'}</TableCell>
                        <TableCell>{profile.cpf || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${profile.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                            {profile.status === 'active' ? 'Ativo' : 'Bloqueado'}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(profile.created_at).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleOpenUserArremates(profile)}
                              title="Gerenciar Arremates"
                            >
                              <Trophy className="w-4 h-4 text-gold" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleToggleUserStatus(profile)}
                              title={profile.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                            >
                              {profile.status === 'active' ? (
                                <Ban className="w-4 h-4 text-destructive" />
                              ) : (
                                <UserCheck className="w-4 h-4 text-success" />
                              )}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" title="Excluir">
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Todos os dados do usuário serão removidos.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(profile)}>
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* App Tab */}
            <TabsContent value="app" className="space-y-6">
              <h2 className="text-2xl font-display font-bold">Aplicativo</h2>
              <ApkUploadSection />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-display font-bold">Configurações do Site</h2>
              {settingsForm && (
                <div className="grid gap-6">
                  <Card>
                    <CardHeader><CardTitle>Contato</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label>Telefone</Label><Input value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} /></div>
                        <div><Label>WhatsApp</Label><Input value={settingsForm.whatsapp} onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })} /></div>
                        <div><Label>E-mail</Label><Input value={settingsForm.email} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} /></div>
                        <div><Label>Endereço</Label><Input value={settingsForm.address} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} /></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Redes Sociais</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label>Facebook</Label><Input value={settingsForm.social_media?.facebook || ''} onChange={(e) => setSettingsForm({ ...settingsForm, social_media: { ...settingsForm.social_media, facebook: e.target.value } })} /></div>
                        <div><Label>Instagram</Label><Input value={settingsForm.social_media?.instagram || ''} onChange={(e) => setSettingsForm({ ...settingsForm, social_media: { ...settingsForm.social_media, instagram: e.target.value } })} /></div>
                        <div><Label>YouTube</Label><Input value={settingsForm.social_media?.youtube || ''} onChange={(e) => setSettingsForm({ ...settingsForm, social_media: { ...settingsForm.social_media, youtube: e.target.value } })} /></div>
                        <div><Label>LinkedIn</Label><Input value={settingsForm.social_media?.linkedin || ''} onChange={(e) => setSettingsForm({ ...settingsForm, social_media: { ...settingsForm.social_media, linkedin: e.target.value } })} /></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Links Externos</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Link Financiamento (Banner)</Label>
                        <Input 
                          value={(settingsForm as any)?.financing_link || ''} 
                          onChange={(e) => setSettingsForm({ ...settingsForm!, financing_link: e.target.value } as any)} 
                          placeholder="https://exemplo.com/financiamento"
                        />
                        <p className="text-xs text-muted-foreground mt-1">URL do botão "Fazer Financiamento" exibido no banner da homepage</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>SEO Homepage</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div><Label>Título Meta</Label><Input value={settingsForm.homepage?.metaTitle || ''} onChange={(e) => setSettingsForm({ ...settingsForm, homepage: { ...settingsForm.homepage, metaTitle: e.target.value } })} /></div>
                      <div><Label>Descrição Meta</Label><Textarea value={settingsForm.homepage?.metaDescription || ''} onChange={(e) => setSettingsForm({ ...settingsForm, homepage: { ...settingsForm.homepage, metaDescription: e.target.value } })} /></div>
                    </CardContent>
                  </Card>
                  <Button onClick={handleSaveSettings} className="w-full md:w-auto"><Save className="w-4 h-4 mr-2" />Salvar Configurações</Button>
                </div>
              )}
            </TabsContent>

            {/* Financeiro Tab */}
            <TabsContent value="financeiro" className="space-y-6">
              <h2 className="text-2xl font-display font-bold">Financeiro</h2>
              
              {/* Contract Generation */}
              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setPayEntregaDialogOpen(true)}>
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto text-primary mb-3" />
                  <h3 className="text-lg font-medium mb-2">Termo de Arremate</h3>
                  <p className="text-sm text-muted-foreground mb-4">Gerar termo de arremate oficial em PDF com dados do arrematante e lote</p>
                  <Button variant="outline" size="sm">Gerar Termo</Button>
                </CardContent>
              </Card>

              {/* Invoice Section - Lists all contracts */}
              <InvoiceSection />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProductId ? 'Editar Produto' : 'Novo Produto'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Título *</Label><Input value={productForm.title || ''} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} /></div>
            <div><Label>Descrição</Label><Textarea value={productForm.description || ''} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Categoria</Label>
                <Select value={productForm.category || ''} onValueChange={(v) => setProductForm({ ...productForm, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Localização *</Label><Input value={productForm.location || ''} onChange={(e) => setProductForm({ ...productForm, location: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Lance Atual</Label><Input type="text" value={productForm.starting_bid ?? ''} onChange={(e) => setProductForm({ ...productForm, starting_bid: e.target.value ? Number(e.target.value) : undefined })} /></div>
              <div><Label>Lote</Label><Input value={productForm.lot_number || ''} onChange={(e) => setProductForm({ ...productForm, lot_number: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Ano</Label><Input type="text" value={productForm.year || ''} onChange={(e) => setProductForm({ ...productForm, year: e.target.value ? parseInt(e.target.value.replace(/\D/g, '')) || 0 : undefined })} /></div>
              <div><Label>Quilometragem</Label><Input value={productForm.quilometragem || ''} onChange={(e) => setProductForm({ ...productForm, quilometragem: e.target.value })} placeholder="Ex: 150.000 km" /></div>
            </div>
            <div>
              <Label>Visualizações (fake)</Label><Input type="text" value={productForm.views || 0} onChange={(e) => setProductForm({ ...productForm, views: e.target.value ? parseInt(e.target.value.replace(/\D/g, '')) || 0 : 0 })} placeholder="0" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data de Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !productForm.opening_date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {productForm.opening_date ? format(new Date(productForm.opening_date), "PPP", { locale: ptBR }) : <span>Selecionar data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={productForm.opening_date ? new Date(productForm.opening_date) : undefined}
                      onSelect={(date) => setProductForm({ ...productForm, opening_date: date?.toISOString() || null })}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Data de Término</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !productForm.closing_date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {productForm.closing_date ? format(new Date(productForm.closing_date), "PPP", { locale: ptBR }) : <span>Selecionar data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={productForm.closing_date ? new Date(productForm.closing_date) : undefined}
                      onSelect={(date) => setProductForm({ ...productForm, closing_date: date?.toISOString() || null })}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label>Imagens</Label>
              <div className="flex gap-2 mt-2">
                <Input placeholder="URL da imagem" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                <Button type="button" variant="outline" onClick={handleAddImage}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(productForm.images || []).map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} alt="" className="w-20 h-20 object-cover rounded" />
                    <button onClick={() => handleRemoveImage(i)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><Switch checked={productForm.is_active} onCheckedChange={(v) => setProductForm({ ...productForm, is_active: v })} /><Label>Ativo</Label></div>
              <div className="flex items-center gap-2"><Switch checked={productForm.is_featured} onCheckedChange={(v) => setProductForm({ ...productForm, is_featured: v })} /><Label>Destaque</Label></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleProductSubmit}>{editingProductId ? 'Salvar' : 'Adicionar'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Banner Dialog */}
      <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingBannerId ? 'Editar Banner' : 'Novo Banner'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Título *</Label><Input value={bannerForm.title || ''} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} /></div>
            <div><Label>Subtítulo</Label><Input value={bannerForm.subtitle || ''} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} /></div>
            <div><Label>Texto Destaque</Label><Input value={bannerForm.highlight_text || ''} onChange={(e) => setBannerForm({ ...bannerForm, highlight_text: e.target.value })} /></div>
            <div><Label>Texto Botão</Label><Input value={bannerForm.cta_text || ''} onChange={(e) => setBannerForm({ ...bannerForm, cta_text: e.target.value })} /></div>
            <div><Label>URL da Imagem</Label><Input value={bannerForm.image_url || ''} onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={bannerForm.is_active} onCheckedChange={(v) => setBannerForm({ ...bannerForm, is_active: v })} /><Label>Ativo</Label></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBannerDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleBannerSubmit}>{editingBannerId ? 'Salvar' : 'Adicionar'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCategoryId ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome *</Label><Input value={categoryForm.name || ''} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} /></div>
            <div><Label>Descrição</Label><Input value={categoryForm.description || ''} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} /></div>
            <div><Label>Ícone</Label>
              <Select value={categoryForm.icon || 'Package'} onValueChange={(v) => setCategoryForm({ ...categoryForm, icon: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{iconOptions.map((icon) => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Cor</Label><Input type="color" value={categoryForm.color || '#f97316'} onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={categoryForm.is_active} onCheckedChange={(v) => setCategoryForm({ ...categoryForm, is_active: v })} /><Label>Ativa</Label></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCategorySubmit}>{editingCategoryId ? 'Salvar' : 'Adicionar'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Arremates Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Arremates de {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Add new arremate form */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Adicionar Arremate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Produto *</Label>
                  <Input 
                    placeholder="Título do produto arrematado" 
                    value={arremateForm.product_title} 
                    onChange={(e) => setArremateForm({ ...arremateForm, product_title: e.target.value })} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valor Final (R$)</Label>
                    <Input 
                      type="number" 
                      value={arremateForm.final_value} 
                      onChange={(e) => setArremateForm({ ...arremateForm, final_value: Number(e.target.value) })} 
                    />
                  </div>
                  <div>
                    <Label>URL Documentação</Label>
                    <Input 
                      placeholder="Link para download" 
                      value={arremateForm.documentation_url} 
                      onChange={(e) => setArremateForm({ ...arremateForm, documentation_url: e.target.value })} 
                    />
                  </div>
                </div>
                <Button onClick={handleAddArremate} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />Adicionar Arremate
                </Button>
              </CardContent>
            </Card>

            {/* List of arremates */}
            <div className="space-y-3">
              <h4 className="font-medium">Arremates do Usuário</h4>
              {selectedUser?.user_id && getArrematsByUserId(selectedUser.user_id).length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum arremate registrado.</p>
              ) : (
                <div className="space-y-2">
                  {selectedUser?.user_id && getArrematsByUserId(selectedUser.user_id).map((arremate) => (
                    <Card key={arremate.id}>
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{arremate.product_title}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>{formatCurrency(arremate.final_value)}</span>
                            <span>{new Date(arremate.date_won).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {arremate.documentation_url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={arremate.documentation_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover arremate?</AlertDialogTitle>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteArremate(arremate.id)}>
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <CreateUserDialog 
        open={isCreateUserDialogOpen} 
        onOpenChange={setIsCreateUserDialogOpen}
        onSuccess={refreshData}
      />

      {/* Pay Entrega Dialog */}
      <PaymentContractDialog
        open={payEntregaDialogOpen}
        onOpenChange={setPayEntregaDialogOpen}
        paymentType="entrega"
        profiles={profiles}
        products={products}
      />

    </>
  );
}
