import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Calendar, 
  LogOut,
  ArrowLeft,
  Shield,
  ChevronRight,
  Heart,
  Trophy
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MeuPerfil = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuthContext();
  const { favorites, arremates } = useData();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/entrar');
    }
  }, [user, loading, navigate]);

  if (loading || !user || !profile) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const totalArremates = arremates?.length || 0;

  return (
    <>
      <Helmet>
        <title>Meu Perfil | arremate24h</title>
        <meta name="description" content="Gerencie seu perfil" />
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
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-white/10 rounded-[5px] flex items-center justify-center border-2 border-accent/50">
                <User className="w-12 h-12 md:w-14 md:h-14 text-accent" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
                <p className="text-primary-foreground/70 mt-1">{profile.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                  <Badge 
                    className={`${
                      profile.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                    } border`}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {profile.status === 'active' ? 'Conta Verificada' : 'Conta Bloqueada'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 md:py-10 max-w-4xl">
          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 -mt-6 relative z-10 mb-6">
            <Link to="/meus-favoritos">
              <Card className="bg-card border-border shadow-card hover:border-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500/10 rounded-[5px] flex items-center justify-center">
                        <Heart className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Favoritos</p>
                        <p className="text-lg font-bold text-foreground">{favorites.length}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/meus-arremates">
              <Card className="bg-card border-border shadow-card hover:border-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-[5px] flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Arremates</p>
                        <p className="text-lg font-bold text-foreground">{totalArremates}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Dados Pessoais */}
          <Card className="border-border bg-card shadow-card">
            <CardContent className="p-5 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-5">
                Dados Pessoais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-[5px]">
                  <User className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Nome Completo</p>
                    <p className="text-sm font-medium text-foreground truncate">{profile.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-[5px]">
                  <Mail className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">E-mail</p>
                    <p className="text-sm font-medium text-foreground truncate">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-[5px]">
                  <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="text-sm font-medium text-foreground">{profile.phone || '--'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-[5px]">
                  <FileText className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">CPF</p>
                    <p className="text-sm font-medium text-foreground">{profile.cpf || '--'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-[5px]">
                  <Calendar className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Membro desde</p>
                    <p className="text-sm font-medium text-foreground">
                      {user.created_at ? format(new Date(user.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '--'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-[5px]">
                  <Shield className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Status da Conta</p>
                    <p className={`text-sm font-medium ${profile.status === 'active' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {profile.status === 'active' ? 'Verificada' : 'Bloqueada'}
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                variant="destructive" 
                className="w-full mt-6"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair da Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MeuPerfil;