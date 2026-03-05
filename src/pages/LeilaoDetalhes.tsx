import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountdownTimer } from "@/components/auction/CountdownTimer";
import { useData } from "@/contexts/DataContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { 
  ArrowLeft, 
  ChevronLeft,
  ChevronRight,
  Heart,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Generate fake random bids based on product id for consistency
const generateFakeBids = (productId: string, lanceAtual: number, increment: number) => {
  const names = [
    "João S.", "Maria L.", "Carlos M.", "Ana P.", "Pedro R.", 
    "Fernanda C.", "Lucas A.", "Juliana F.", "Roberto G.", "Patricia B.",
    "André N.", "Camila V.", "Rafael T.", "Beatriz O.", "Gustavo H."
  ];
  
  // Use product id to generate consistent random seed
  const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const numBids = 5 + (seed % 8); // 5-12 bids
  
  const bids = [];
  const incrementValue = increment || 1000;
  
  // Start from lance atual and go backwards (most recent bid is the highest)
  for (let i = 0; i < numBids; i++) {
    const nameIndex = (seed + i * 7) % names.length;
    const minutesAgo = i === 0 ? Math.floor((seed + i) % 5) + 1 : Math.floor((seed + i * 3) % 30) + (i * 5);
    
    // Calculate bid value: first bid is the lance atual, subsequent bids are lower
    const bidValue = lanceAtual - (i * incrementValue);
    
    // Only add if bid value is positive
    if (bidValue > 0) {
      bids.push({
        id: `bid-${i}`,
        bidder: names[nameIndex],
        value: bidValue,
        time: new Date(Date.now() - minutesAgo * 60 * 1000),
      });
    }
  }
  
  return bids;
};

const LeilaoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, siteSettings, isFavorite, addFavorite, removeFavorite } = useData();
  const { user } = useAuthContext();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auction = getProductById(id || "");
  const productIsFavorite = isFavorite(id || "");
  const isLoggedIn = !!user;
  const fakeBids = auction ? generateFakeBids(id || "", auction.starting_bid || 0, auction.bid_increment || 1000) : [];

  if (!auction) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Leilão não encontrado</h1>
            <p className="text-muted-foreground mb-6">O leilão que você procura não existe ou foi removido.</p>
            <Button asChild>
              <Link to="/leiloes">Ver todos os leilões</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = auction.images && auction.images.length > 0 
    ? auction.images 
    : ['/placeholder.svg'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "--";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const handleWhatsApp = () => {
    const bidValue = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      (auction.current_bid || auction.starting_bid || 0) + 100
    );
    const message = encodeURIComponent(`Olá! Tenho interesse no lote ${auction.lot_number} - ${auction.title}. Meu lance é de ${bidValue}`);
    window.open(`https://wa.me/${siteSettings?.whatsapp}?text=${message}`, '_blank');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <>
      <Helmet>
        <title>{auction.title} | arremate24h</title>
        <meta name="description" content={auction.description} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">
            {/* Back Button */}
            <Link 
              to="/leiloes" 
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>

            {/* Title */}
            <h1 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-6">
              {auction.title}
            </h1>

            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
              {/* Left Column - Images */}
              <div className="space-y-4">
                {/* Image Gallery */}
                <div className="relative rounded-lg overflow-hidden bg-card border border-border">
                  <img
                    src={images[currentImageIndex]}
                    alt={auction.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-md"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-md"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-all",
                          currentImageIndex === index ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
                        )}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1 bg-success/10 text-success border-success/30 hover:bg-success/20" onClick={handleWhatsApp}>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "flex-1 gap-2",
                      productIsFavorite && "bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20"
                    )}
                    onClick={() => {
                      if (!isLoggedIn) {
                        toast.error("Faça login para adicionar aos favoritos");
                        navigate('/entrar');
                        return;
                      }
                      if (productIsFavorite) {
                        removeFavorite(id || "");
                        toast.success("Removido dos favoritos");
                      } else {
                        addFavorite(id || "");
                        toast.success("Adicionado aos favoritos");
                      }
                    }}
                  >
                    <Heart className={cn("w-4 h-4", productIsFavorite && "fill-current")} />
                    {productIsFavorite ? 'Favoritado' : 'Favoritar'}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
                    <Link to="/edital">
                      <FileText className="w-4 h-4" />
                      Edital
                    </Link>
                  </Button>
                </div>

                {/* Description - Hidden on mobile, shown on desktop */}
                <Card className="hidden lg:block">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">DESCRIÇÃO</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {auction.description}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Bid Panel */}
              <div className="space-y-4">
                {/* Main Bid Card */}
                <Card className="border-2 border-gold/30">
                  <CardContent className="p-5 space-y-4">
                    {/* Timer - Centered */}
                    <div className="flex justify-center">
                      <CountdownTimer endDate={auction.closing_date ? new Date(auction.closing_date) : undefined} size="sm" variant="compact" />
                    </div>

                    {/* Lance Atual */}
                    <div>
                      <p className="text-sm text-primary">Lance Atual:</p>
                      <p className="font-display text-3xl font-bold text-primary">
                        {auction.starting_bid ? formatCurrency(auction.starting_bid) : '--'}
                      </p>
                    </div>

                    {/* Dates Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Abertura:</p>
                        <p className="font-semibold">{formatDate(auction.opening_date ? new Date(auction.opening_date) : undefined)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Encerramento:</p>
                        <p className="font-semibold">{formatDate(auction.closing_date ? new Date(auction.closing_date) : undefined)}</p>
                      </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Quilometragem:</p>
                        <p className="text-sm font-semibold text-primary">{auction.quilometragem || "--"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ano:</p>
                        <p className="text-sm font-semibold text-primary">{auction.year || "--"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Localização:</p>
                        <p className="text-sm font-semibold text-primary">{auction.location}</p>
                      </div>
                    </div>

                    {/* Bid Amount */}
                    <div className="text-center py-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">Arrematar por</p>
                      <p className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          ((auction.current_bid || auction.starting_bid || 0) + 100)
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">para superar os lances</p>
                    </div>

                    {/* WhatsApp Button */}
                    <button
                      onClick={handleWhatsApp}
                      className="w-full inline-flex items-center justify-center gap-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow h-12 px-4 py-2 bg-[#39881e] text-white border-[#39881e] hover:bg-[#39881e]/90 font-semibold whitespace-nowrap text-sm uppercase tracking-wide"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Arremate agora via WhatsApp
                    </button>

                    {/* Commission Warning */}
                    <p className="text-xs text-muted-foreground italic">
                      Após autenticar o documento no cartório para arrematar o veículo, você é obrigado por lei a pagar 30% do lance, conforme Art. 892, §1º do Código de Processo Civil (Lei nº 13.105/2015).
                    </p>
                  </CardContent>
                </Card>

                {/* Views Count */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Visualizações:</span>
                      <span className="font-semibold">{auction.views || 0}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">Nº de Lances:</span>
                      <span className="font-semibold">{fakeBids.length}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Bid History */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">HISTÓRICO DE LANCES</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-64 overflow-y-auto">
                      {fakeBids.map((bid, index) => (
                        <div 
                          key={bid.id} 
                          className={cn(
                            "flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0",
                            index === 0 && "bg-success/10"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                              {bid.bidder.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{bid.bidder}</p>
                              <p className="text-xs text-muted-foreground">
                                {Math.floor((Date.now() - bid.time.getTime()) / 60000)} min atrás
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={cn(
                              "font-semibold",
                              index === 0 ? "text-success" : "text-foreground"
                            )}>
                              {formatCurrency(bid.value)}
                            </p>
                            {index === 0 && (
                              <Badge variant="success" className="text-[10px] px-1.5 py-0">
                                Maior Lance
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Description - Shown on mobile only, after bid panel */}
                <Card className="lg:hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">DESCRIÇÃO</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {auction.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LeilaoDetalhes;