import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  Wrench, 
  FileCheck, 
  Calculator, 
  Shield, 
  Headphones,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";

const services = [
  {
    title: "Transporte Especializado",
    description: "Serviço de transporte de máquinas agrícolas em todo o Brasil com segurança e pontualidade.",
    icon: Truck,
    features: [
      "Carretas especializadas para máquinas pesadas",
      "Rastreamento em tempo real",
      "Seguro de carga incluso",
      "Cobertura nacional",
    ],
    cta: "Solicitar Orçamento",
  },
  {
    title: "Manutenção e Revisão",
    description: "Serviços de manutenção preventiva e corretiva para equipamentos agrícolas.",
    icon: Wrench,
    features: [
      "Mecânicos especializados",
      "Peças originais e paralelas",
      "Atendimento em campo",
      "Garantia nos serviços",
    ],
    cta: "Agendar Serviço",
  },
  {
    title: "Vistoria Técnica",
    description: "Avaliação técnica completa de máquinas e implementos agrícolas.",
    icon: FileCheck,
    features: [
      "Laudo técnico detalhado",
      "Análise de componentes",
      "Horímetro e histórico",
      "Relatório fotográfico",
    ],
    cta: "Solicitar Vistoria",
  },
  {
    title: "Avaliação de Máquinas",
    description: "Avaliação de mercado para compra, venda ou financiamento de equipamentos.",
    icon: Calculator,
    features: [
      "Valor de mercado atualizado",
      "Comparativo de preços",
      "Análise de depreciação",
      "Certificado de avaliação",
    ],
    cta: "Avaliar Equipamento",
  },
  {
    title: "Seguro Agrícola",
    description: "Proteção completa para suas máquinas e implementos agrícolas.",
    icon: Shield,
    features: [
      "Cobertura contra roubo e furto",
      "Proteção contra incêndio",
      "Danos por acidentes",
      "Parceiros seguradoras",
    ],
    cta: "Cotar Seguro",
  },
  {
    title: "Suporte ao Cliente",
    description: "Atendimento especializado para dúvidas e assistência em todas as etapas.",
    icon: Headphones,
    features: [
      "Atendimento via WhatsApp",
      "Suporte por telefone",
      "Chat online",
      "Resposta em até 2 horas",
    ],
    cta: "Falar com Suporte",
  },
];

const stats = [
  { value: "500+", label: "Transportes realizados" },
  { value: "98%", label: "Satisfação dos clientes" },
  { value: "24h", label: "Tempo médio de resposta" },
  { value: "27", label: "Estados atendidos" },
];

export default function Servicos() {
  const { siteSettings } = useData();
  
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Olá! Gostaria de saber mais sobre os serviços da arremate24h.");
    window.open(`https://wa.me/${siteSettings?.whatsapp || '5521979654426'}?text=${message}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Outros Serviços | arremate24h</title>
        <meta name="description" content="Conheça os serviços complementares da arremate24h: transporte, manutenção, vistoria, avaliação e muito mais." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Outros Serviços
            </h1>
            <p className="text-xl text-primary-foreground/80 mx-auto">
              Soluções completas para o agronegócio brasileiro
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-display text-3xl lg:text-4xl font-bold text-accent">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Nossos Serviços
              </h2>
              <p className="text-muted-foreground">
                Oferecemos uma gama completa de serviços para atender todas as suas necessidades.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow border-border">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      <service.icon className="w-7 h-7 text-accent" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-colors"
                      onClick={handleWhatsApp}
                    >
                      {service.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">
              Precisa de um serviço personalizado?
            </h2>
            <p className="text-primary-foreground/80 mb-8 mx-auto">
              Entre em contato conosco e nossa equipe vai encontrar a melhor solução para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="gold" 
                size="lg" 
                className="gap-2"
                onClick={handleWhatsApp}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Falar no WhatsApp
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/contato">
                  Enviar Mensagem
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
