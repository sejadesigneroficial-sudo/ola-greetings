import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuctionCardCompact } from "@/components/auction/AuctionCardCompact";
import { useData } from "@/contexts/DataContext";
import { ArrowRight, Loader2 } from "lucide-react";

interface AuctionGridProps {
  selectedCategory: string;
  searchQuery: string;
  showFeatured: boolean;
}

export function AuctionGrid({ selectedCategory, searchQuery, showFeatured }: AuctionGridProps) {
  const { products, loading } = useData();

  // Only show active products
  const activeProducts = products.filter(p => p.is_active);

  // Filter products
  const filteredAuctions = activeProducts.filter((auction) => {
    const matchesCategory = selectedCategory === "geral" || 
      auction.category?.toLowerCase().includes(selectedCategory);
    const matchesSearch = searchQuery === "" || 
      auction.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFeatured = !showFeatured || auction.is_featured;
    
    return matchesCategory && matchesSearch && matchesFeatured;
  });

  if (loading) {
    return (
      <section className="py-8 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  // If no products exist at all, show a different message
  if (activeProducts.length === 0) {
    return (
      <section className="py-8 relative">
        <div className="container mx-auto px-4">
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground text-lg">Nenhum produto cadastrado no momento.</p>
            <p className="text-muted-foreground text-sm mt-2">Em breve teremos novos lotes disponíveis.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 relative">
      <div className="container mx-auto px-4">
        {/* Grid */}
        {filteredAuctions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum lote encontrado para os filtros selecionados.</p>
          </div>
        )}

        {/* Ver Mais Button */}
        {filteredAuctions.length > 0 && (
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link to="/leiloes">
                Ver todos os lotes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
