import { Link } from "react-router-dom";
import { 
  Tractor, 
  Truck, 
  Cog, 
  Wheat, 
  Droplets,
  Zap,
  ArrowRight,
  LucideIcon,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useData } from "@/contexts/DataContext";

const iconMap: Record<string, LucideIcon> = {
  Tractor,
  Truck,
  Cog,
  Wheat,
  Droplets,
  Zap,
  Package,
};

export function CategoryGrid() {
  const { categories, products } = useData();
  const activeCategories = categories.filter(c => c.is_active);

  // Don't render if no active categories
  if (activeCategories.length === 0) {
    return null;
  }

  const getCategoryCount = (categoryName: string) => {
    return products.filter(p => p.category === categoryName && p.is_active).length;
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Explore por Categoria
          </h2>
            <p className="text-muted-foreground mx-auto">
              Encontre exatamente o que procura. Navegue por nossas categorias de 
              carros, motos e veículos.
            </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {activeCategories.map((category, index) => {
            const IconComponent = iconMap[category.icon] || Package;
            const count = getCategoryCount(category.name);
            
            return (
              <Link
                key={category.id}
                to={`/leiloes?categoria=${category.name.toLowerCase()}`}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
                  {/* Icon Container */}
                  <div 
                    className="w-14 h-14 mx-auto mb-4 rounded-lg flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: category.color }}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>

                  {/* Text */}
                  <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {category.description}
                  </p>
                  <span className="text-xs font-medium text-primary">
                    {count} lotes
                  </span>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
