import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { AuctionCardCompact } from '@/components/auction/AuctionCardCompact';
import { ArrowLeft, Heart, Package, Loader2 } from 'lucide-react';

const MeusFavoritos = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthContext();
  const { products, favorites, loading } = useData();

  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/entrar');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <>
      <Helmet>
        <title>Meus Favoritos | arremate24h</title>
        <meta name="description" content="Veja seus produtos favoritos" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
        {/* Hero Section */}
        <div className="bg-gradient-forest text-primary-foreground">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-[5px] flex items-center justify-center border border-accent/50">
                <Heart className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Meus Favoritos</h1>
                <p className="text-primary-foreground/70 mt-1">
                  {favoriteProducts.length} {favoriteProducts.length === 1 ? 'produto' : 'produtos'} salvos
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 md:py-10">
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto bg-muted rounded-[5px] flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium text-foreground">Nenhum favorito ainda</p>
              <p className="text-sm text-muted-foreground mt-1">Adicione produtos aos favoritos para acessá-los rapidamente!</p>
              <Button 
                className="mt-5 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => navigate('/leiloes')}
              >
                Explorar Leilões
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favoriteProducts.map((product) => (
                <AuctionCardCompact
                  key={product.id}
                  auction={product}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MeusFavoritos;
