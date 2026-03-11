import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Eye, 
  Heart,
  Award,
  Users,
  TrendingUp,
  Shield,
  Recycle
} from "lucide-react";

const stats = [
  { value: "15.000+", label: "Usuários cadastrados" },
  { value: "R$ 50M+", label: "Em leilões realizados" },
  { value: "2.500+", label: "Lotes arrematados" },
  { value: "98%", label: "Satisfação dos clientes" },
];

const values = [
  {
    icon: Shield,
    title: "Segurança",
    description: "Todas as transações são protegidas e verificadas, garantindo tranquilidade para compradores e vendedores.",
  },
  {
    icon: Eye,
    title: "Transparência",
    description: "Informações claras e completas sobre todos os lotes, com histórico e documentação verificada.",
  },
  {
    icon: Heart,
    title: "Compromisso",
    description: "Dedicação total aos nossos clientes, oferecendo suporte especializado em todas as etapas.",
  },
  {
    icon: Recycle,
    title: "Sustentabilidade",
    description: "Promovemos a reutilização de veículos, contribuindo para um mercado mais sustentável.",
  },
];

const team = [
  {
    name: "Roberto Silva",
    role: "CEO & Fundador",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  },
  {
    name: "Ana Santos",
    role: "Diretora Comercial",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
  },
  {
    name: "Carlos Oliveira",
    role: "Diretor de Operações",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
  },
];

const QuemSomos = () => {
  return (
    <>
      <Helmet>
        <title>Quem Somos | arremate24h</title>
        <meta 
          name="description" 
          content="Conheça a arremate24h, a maior plataforma de leilões de carros e motos do Brasil. Nossa história, missão e valores." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          {/* Hero */}
          <section className="bg-gradient-to-br from-forest to-forest-dark py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h1 className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground mb-4">
                  Quem Somos
                </h1>
                <p className="text-xl text-primary-foreground/80">
                  Somos a maior plataforma de leilões de carros e motos do Brasil, 
                  conectando compradores e vendedores com tecnologia, segurança e transparência.
                </p>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="py-12 -mt-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <Card 
                    key={stat.label} 
                    variant="featured"
                    className="text-center animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <p className="font-display text-3xl lg:text-4xl font-bold text-primary mb-1">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* History */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
                    Nossa História
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      A arremate24h nasceu com uma missão clara: revolucionar o mercado 
                      de carros e motos usados no Brasil. Identificamos uma lacuna no setor, 
                      onde compradores e vendedores enfrentavam dificuldades para se conectar 
                      de forma segura e transparente.
                    </p>
                    <p>
                      Com uma equipe apaixonada pelo mercado automotivo e expertise em tecnologia, 
                      desenvolvemos uma plataforma que simplifica todo o processo de compra e 
                      venda de veículos, de carros populares a motos esportivas.
                    </p>
                    <p>
                      Hoje, somos referência no mercado, com milhares de leilões realizados e 
                      uma comunidade crescente de compradores, empresários e revendedores que 
                      confiam em nossa plataforma para fazer negócios.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80"
                    alt="Carros em leilão"
                    className="rounded-lg shadow-xl"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-gold rounded-lg p-6 shadow-lg">
                    <Award className="w-8 h-8 text-accent-foreground mb-2" />
                    <p className="font-display font-bold text-accent-foreground">
                      Leilões 24h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8">
                <Card variant="elevated">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Target className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                      Nossa Missão
                    </h3>
                    <p className="text-muted-foreground">
                      Democratizar o acesso a carros e motos de qualidade, conectando 
                      compradores e vendedores em uma plataforma segura, transparente e 
                      eficiente, impulsionando o mercado automotivo brasileiro.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Eye className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                      Nossa Visão
                    </h3>
                    <p className="text-muted-foreground">
                      Ser a principal referência em leilões de veículos no Brasil, 
                      reconhecida pela inovação, qualidade de serviço e 
                      contribuição para um mercado automotivo mais acessível e transparente.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Nossos Valores
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Os princípios que guiam todas as nossas ações e decisões.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div
                    key={value.title}
                    className="text-center animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-forest to-forest-light flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                      <value.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Nossa Equipe
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Profissionais dedicados a oferecer a melhor experiência em leilões de veículos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {team.map((member, index) => (
                  <Card 
                    key={member.name}
                    variant="elevated"
                    className="text-center animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-lg mx-auto mb-4 object-cover"
                      />
                      <h3 className="font-display font-semibold text-foreground">
                        {member.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {member.role}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default QuemSomos;
