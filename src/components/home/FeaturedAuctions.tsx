import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuctionCardCompact } from "@/components/auction/AuctionCardCompact";
import { useData } from "@/contexts/DataContext";
import { ArrowRight, Flame } from "lucide-react";

export function FeaturedAuctions() {
  const { products } = useData();
  
  // Get featured products or first 4 if none are featured
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 
    ? featuredProducts 
    : products.slice(0, 4);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-destructive" />
              <span className="text-sm font-medium text-destructive uppercase tracking-wider">
                Leilões em Destaque
              </span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Oportunidades Imperdíveis
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Confira os leilões mais disputados do momento. Lance agora e garanta 
              as melhores máquinas agrícolas do mercado.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/leiloes">
              Ver todos os leilões
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map((auction, index) => (
            <div 
              key={auction.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AuctionCardCompact auction={auction} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
