import { cn } from "@/lib/utils";
import { useData } from "@/contexts/DataContext";

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryPills({ selectedCategory, onSelectCategory }: CategoryPillsProps) {
  const { categories } = useData();
  
  const activeCategories = categories.filter(cat => cat.is_active);
  
  // Don't render if no categories exist
  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 py-6">
      <button
        onClick={() => onSelectCategory("geral")}
        className={cn(
          "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2",
          selectedCategory === "geral"
            ? "bg-primary text-primary-foreground border-primary shadow-md"
            : "bg-card text-foreground border-border hover:border-primary hover:text-primary"
        )}
      >
        Geral
      </button>
      {activeCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.name.toLowerCase())}
          className={cn(
            "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2",
            selectedCategory === category.name.toLowerCase()
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-card text-foreground border-border hover:border-primary hover:text-primary"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
