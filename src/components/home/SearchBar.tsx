import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onToggleView: (showFeatured: boolean) => void;
  showFeatured: boolean;
}

export function SearchBar({ onSearch, onToggleView, showFeatured }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="bg-card rounded-lg shadow-lg border border-border -mt-8 relative z-20 max-w-4xl mx-0 lg:mx-auto">
      <form onSubmit={handleSubmit} className="p-3 md:p-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="O que você está buscando?"
              className="pl-10 md:pl-12 h-11 md:h-12 text-sm md:text-base border-2 border-border focus:border-accent bg-background"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button variant="gold" type="submit" className="h-11 md:h-12 px-6 md:px-8 text-sm md:text-base">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </form>

      {/* Toggle Row */}
      <div className="border-t border-border px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-center gap-4 md:gap-6 bg-muted/50 rounded-b-lg">
        <div className="flex items-center gap-2 md:gap-3">
          <LayoutGrid className="w-3.5 md:w-4 h-3.5 md:h-4 text-muted-foreground" />
          <Label htmlFor="featured-toggle" className="text-xs md:text-sm text-muted-foreground cursor-pointer">
            Destaques
          </Label>
          <Switch
            id="featured-toggle"
            checked={!showFeatured}
            onCheckedChange={(checked) => onToggleView(!checked)}
            className="data-[state=checked]:bg-accent"
          />
          <Label htmlFor="featured-toggle" className="text-xs md:text-sm text-muted-foreground cursor-pointer">
            Geral
          </Label>
          <List className="w-3.5 md:w-4 h-3.5 md:h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
