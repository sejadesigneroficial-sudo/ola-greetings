import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuctionCardCompact } from "@/components/auction/AuctionCardCompact";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useData } from "@/contexts/DataContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Grid, List, SlidersHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const statusFilters = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "upcoming", label: "Em breve" },
  { value: "ended", label: "Encerrados" },
];

const Leiloes = () => {
  const { products, siteSettings, categories, loading } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Build categories from data
  const categoryOptions = [
    { value: "all", label: "Todas as categorias" },
    ...categories.filter(c => c.is_active).map(c => ({ value: c.name.toLowerCase(), label: c.name }))
  ];

  // Determine status for a product
  const getProductStatus = (product: typeof products[0]) => {
    const now = new Date();
    const closingDate = product.closing_date ? new Date(product.closing_date) : null;
    const openingDate = product.opening_date ? new Date(product.opening_date) : null;
    
    if (!closingDate) return "active";
    if (closingDate < now) return "ended";
    if (openingDate && openingDate > now) return "upcoming";
    return "active";
  };

  const filteredAuctions = products.filter((auction) => {
    if (!auction.is_active) return false;
    
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (auction.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
      auction.category?.toLowerCase() === selectedCategory;
    const status = getProductStatus(auction);
    const matchesStatus = selectedStatus === "all" || status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeCount = products.filter(a => a.is_active && getProductStatus(a) === "active").length;
  const upcomingCount = products.filter(a => a.is_active && getProductStatus(a) === "upcoming").length;

  return (
    <>
      <Helmet>
        <title>{siteSettings?.leiloes_page?.title || "Leilões de Máquinas Agrícolas"} | arremate24h</title>
        <meta 
          name="description" 
          content={siteSettings?.leiloes_page?.metaDescription || "Encontre os melhores leilões de tratores, colheitadeiras e implementos agrícolas."} 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          {/* Page Header */}
          <section className="bg-gradient-to-br from-forest to-forest-dark py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                  {siteSettings?.leiloes_page?.title || "Leilões de Máquinas Agrícolas"}
                </h1>
                <p className="text-primary-foreground/80 mb-6">
                  {siteSettings?.leiloes_page?.description || "Encontre tratores, colheitadeiras, implementos e veículos com as melhores condições do mercado."}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="gold" className="px-3 py-1.5">
                    {activeCount} leilões ativos
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1.5 bg-primary-foreground/20 text-primary-foreground border-0">
                    {upcomingCount} em breve
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="border-b border-border bg-card">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar leilões..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-36">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusFilters.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {filteredAuctions.length} resultado(s)
                  </span>
                  <div className="flex border border-border rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        viewMode === "grid" 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        viewMode === "list" 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Auctions Grid */}
          <section className="py-8 lg:py-12">
            <div className="container mx-auto px-4">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredAuctions.length > 0 ? (
                <div className={cn(
                  "grid gap-6",
                  viewMode === "grid" 
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1"
                )}>
                  {filteredAuctions.map((auction, index) => (
                    <div 
                      key={auction.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <AuctionCardCompact auction={auction} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    Nenhum leilão encontrado
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Tente ajustar os filtros ou fazer uma nova busca.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedStatus("all");
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Leiloes;
