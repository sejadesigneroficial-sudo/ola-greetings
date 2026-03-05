import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Download, 
  Trophy,
  ArrowLeft,
  Calendar,
  DollarSign,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MeusArremates = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const { arremates } = useData();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/entrar');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalArremates = arremates?.length || 0;
  const totalValue = arremates?.reduce((acc, arr) => acc + arr.final_value, 0) || 0;

  return (
    <>
      <Helmet>
        <title>Meus Arremates | arremate24h</title>
        <meta name="description" content="Visualize todos os itens que você arrematou nos leilões" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 md:mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <Trophy className="w-7 h-7 md:w-8 md:h-8 text-accent" />
              Meus Arremates
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Acompanhe todos os itens que você arrematou nos leilões
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-[5px] flex items-center justify-center">
                    <Trophy className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs md:text-sm text-muted-foreground">Total de Arremates</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{totalArremates}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-[5px] flex items-center justify-center">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs md:text-sm text-muted-foreground">Valor Total Investido</p>
                    <p className="text-lg md:text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Arremates List */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3 md:pb-4 border-b border-border">
              <CardTitle className="flex items-center justify-between text-base md:text-lg text-foreground">
                <span className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Lista de Arremates
                </span>
                <Badge variant="secondary" className="text-xs">
                  {totalArremates} {totalArremates === 1 ? 'item' : 'itens'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6">
              {totalArremates === 0 ? (
                <div className="text-center py-12 md:py-16 text-muted-foreground">
                  <Package className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 opacity-30" />
                  <p className="text-lg md:text-xl font-medium">Nenhum arremate encontrado</p>
                  <p className="text-sm md:text-base mt-2">Você ainda não arrematou nenhum item nos leilões</p>
                  <Button 
                    className="mt-6"
                    onClick={() => navigate('/leiloes')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Leilões Ativos
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {arremates.map((arremate, index) => (
                    <div 
                      key={arremate.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 bg-muted/30 rounded-[5px] border border-border gap-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-[5px] flex items-center justify-center flex-shrink-0">
                          <span className="text-accent font-bold text-sm md:text-base">#{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-sm md:text-base truncate">
                            {arremate.product_title}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {arremate.date_won ? format(new Date(arremate.date_won), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '--'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-accent" />
                              <span className="font-bold text-accent text-sm md:text-base">
                                {formatCurrency(arremate.final_value)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {arremate.documentation_url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full md:w-auto text-xs md:text-sm border-primary/30 hover:bg-primary/10"
                          asChild
                        >
                          <a href={arremate.documentation_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Documentos
                          </a>
                        </Button>
                      ) : (
                        <Badge variant="outline" className="w-fit text-xs text-muted-foreground">
                          Documentos pendentes
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          {totalArremates > 0 && (
            <Card className="mt-6 bg-primary/5 border-primary/20">
              <CardContent className="p-4 md:p-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Dúvidas sobre seus arremates?</strong> Entre em contato conosco através do WhatsApp ou telefone disponíveis no rodapé da página.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MeusArremates;
