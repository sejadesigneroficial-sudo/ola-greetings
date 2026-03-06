import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "./CountdownTimer";
import { MapPin, Eye, TrendingUp } from "lucide-react";
import { useData, Product } from "@/contexts/DataContext";
import { useRealtimeBid } from "@/hooks/useRealtimeBid";
import { cn } from "@/lib/utils";

interface AuctionCardCompactProps {
  auction: Product;
}

export function AuctionCardCompact({ auction }: AuctionCardCompactProps) {
  const { siteSettings } = useData();
  const { currentBid, isFlashing, bidCount } = useRealtimeBid(
    auction.id,
    auction.current_bid || auction.starting_bid || 0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = encodeURIComponent(`Olá! Tenho interesse no lote ${auction.lot_number} - ${auction.title}`);
    window.open(`https://wa.me/${siteSettings?.whatsapp || '5521979654426'}?text=${message}`, '_blank');
  };

  // Determine auction status based on dates
  const now = new Date();
  const closingDate = auction.closing_date ? new Date(auction.closing_date) : null;
  const openingDate = auction.opening_date ? new Date(auction.opening_date) : null;

  const isActive = closingDate && closingDate > now && (!openingDate || openingDate <= now);

  return (
    <Card variant="auction" className="overflow-hidden group">
      {/* Image Container */}
      <Link to={`/leilao/${auction.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={auction.images?.[0] || '/placeholder.svg'}
            alt={auction.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Lot Badge */}
          {auction.lot_number && (
            <div className="absolute top-3 right-3">
              <Badge variant="gold" className="text-xs font-bold">
                #{auction.lot_number}
              </Badge>
            </div>
          )}

          {/* Status Badge */}
          {isActive && (
            <div className="absolute top-3 left-3">
              <Badge variant="live" className="text-[10px]">AO VIVO</Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        {/* Countdown Timer */}
        {isActive && closingDate && (
          <div className="flex justify-center">
            <CountdownTimer endDate={closingDate} size="sm" variant="compact" />
          </div>
        )}

        {/* Title */}
        <Link to={`/leilao/${auction.id}`}>
          <h3 className="font-display font-semibold text-sm text-foreground line-clamp-2 group-hover:text-accent transition-colors min-h-[40px]">
            {auction.title}
          </h3>
        </Link>

        {/* Year, Location and Views Row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {auction.year && (
              <span className="font-medium">{auction.year}</span>
            )}
            {auction.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {auction.location.split(',')[0]}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {auction.views || 0}
          </span>
        </div>

        {/* Price — real-time bid with flash animation */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Lance atual</p>
            {bidCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-accent font-semibold animate-fade-in">
                <TrendingUp className="w-3 h-3" />
                +{bidCount} lance{bidCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p
            className={cn(
              "font-display font-bold text-lg transition-colors duration-300",
              isFlashing
                ? "text-accent scale-105 drop-shadow-[0_0_8px_hsl(var(--accent)/0.7)]"
                : "text-accent"
            )}
            style={{
              transition: isFlashing
                ? 'color 0.15s ease, transform 0.15s ease'
                : 'color 0.6s ease, transform 0.6s ease',
              transform: isFlashing ? 'scale(1.05)' : 'scale(1)',
              display: 'inline-block',
            }}
          >
            {formatCurrency(currentBid)}
          </p>
        </div>

        {/* Buttons Row */}
        <div className="flex gap-2">
          <button
            onClick={handleWhatsAppClick}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow h-9 px-3 py-2 bg-[#39881e] text-white border-[#39881e] hover:bg-[#39881e]/90 font-semibold whitespace-nowrap text-xs uppercase tracking-wide"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>
          <Link
            to={`/leilao/${auction.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow h-9 px-3 py-2 bg-transparent border border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold whitespace-nowrap text-xs uppercase tracking-wide"
          >
            Detalhes
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
