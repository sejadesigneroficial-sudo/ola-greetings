import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "./CountdownTimer";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  category: string;
  location: string;
  startingPrice: number;
  currentBid: number;
  bidCount: number;
  endDate: Date;
  openingDate?: Date;
  status: "active" | "upcoming" | "ended";
  featured?: boolean;
  lotNumber?: string;
  year?: string;
  views?: number;
  // New fields
  serialNumber?: string;
  model?: string;
  hourMeter?: string;
  manufacturer?: string;
  increment?: number;
}

interface AuctionCardProps {
  auction: AuctionItem;
  featured?: boolean;
}

export function AuctionCard({ auction, featured = false }: AuctionCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadge = () => {
    switch (auction.status) {
      case "active":
        return <Badge variant="live">AO VIVO</Badge>;
      case "upcoming":
        return <Badge variant="warning">EM BREVE</Badge>;
      case "ended":
        return <Badge variant="secondary">ENCERRADO</Badge>;
    }
  };

  return (
    <Card variant={featured ? "featured" : "auction"} className="group">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={auction.image}
          alt={auction.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {getStatusBadge()}
          {featured && <Badge variant="gold">DESTAQUE</Badge>}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {auction.category}
          </Badge>
        </div>

        {/* Timer - Bottom of image */}
        {auction.status === "active" && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="glass rounded-lg px-3 py-2">
              <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Encerra em</p>
              <CountdownTimer endDate={auction.endDate} size="sm" />
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title & Description */}
        <h3 className="font-display font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {auction.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {auction.description}
        </p>

        {/* Location & Bids */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {auction.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {auction.bidCount} lances
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Lance atual</p>
            <p className="text-xl font-bold font-display text-primary">
              {formatCurrency(auction.currentBid)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Lance inicial</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(auction.startingPrice)}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant={auction.status === "active" ? "bid" : "outline"} 
          className="w-full"
          asChild
        >
          <Link to={`/leilao/${auction.id}`}>
            {auction.status === "active" ? "Dar Lance" : "Ver Detalhes"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}