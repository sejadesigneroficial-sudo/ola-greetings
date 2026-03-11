import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchBar } from "@/components/home/SearchBar";
import { CategoryPills } from "@/components/home/CategoryPills";
import { AuctionGrid } from "@/components/home/AuctionGrid";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import { useData } from "@/contexts/DataContext";

const Index = () => {
  const { siteSettings } = useData();
  const homepage = siteSettings?.homepage;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("geral");
  const [showFeatured, setShowFeatured] = useState(true);

  return (
    <>
      <Helmet>
        <title>{homepage?.metaTitle || "arremate24h - O Maior Leilão de Carros e Motos do Brasil"}</title>
        <meta
          name="description"
          content={
            homepage?.metaDescription ||
            "Participe dos melhores leilões de carros, motos e veículos. Lance com segurança e encontre as melhores oportunidades do mercado."
          }
        />
        <meta
          name="keywords"
          content="leilão de carros, leilão de motos, leilão de veículos, leilão online, arremate24h"
        />
        <link rel="canonical" href="https://arremate24h.com.br" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          {/* Hero with Banner */}
          <HeroSection />

          {/* Search Bar */}
          <div className="container mx-auto">
            <SearchBar onSearch={setSearchQuery} onToggleView={setShowFeatured} showFeatured={showFeatured} />
          </div>

          {/* Category Pills */}
          <div className="container mx-auto px-4 mt-6">
            <CategoryPills selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </div>

          {/* Auction Grid */}
          <AuctionGrid selectedCategory={selectedCategory} searchQuery={searchQuery} showFeatured={showFeatured} />

          {/* Features */}
          <FeaturesSection />

          {/* CTA */}
          <CTASection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
