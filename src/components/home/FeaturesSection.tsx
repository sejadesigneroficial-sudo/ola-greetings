import { 
  Shield, 
  Gavel, 
  Clock, 
  CreditCard, 
  FileText, 
  Headphones 
} from "lucide-react";
import { useData } from "@/contexts/DataContext";

const defaultFeatures = [
  {
    icon: Shield,
    title: "Segurança Garantida",
    description: "Todas as transações são protegidas e verificadas. Seus dados estão seguros conosco.",
  },
  {
    icon: Gavel,
    title: "Lances em Tempo Real",
    description: "Sistema de lances instantâneo com atualizações ao vivo durante todo o leilão.",
  },
  {
    icon: Clock,
    title: "Leilões 24/7",
    description: "Participe de leilões a qualquer hora. Nossa plataforma está sempre disponível.",
  },
  {
    icon: CreditCard,
    title: "Pagamento Facilitado",
    description: "Diversas formas de pagamento para sua comodidade e segurança.",
  },
  {
    icon: FileText,
    title: "Documentação Completa",
    description: "Toda documentação necessária é verificada e disponibilizada para consulta.",
  },
  {
    icon: Headphones,
    title: "Suporte Especializado",
    description: "Equipe de especialistas pronta para ajudar em todas as etapas do processo.",
  },
];

export function FeaturesSection() {
  const { siteSettings } = useData();
  const homepage = siteSettings?.homepage;

  // Use admin settings if available, otherwise use defaults
  const features = [
    {
      icon: Shield,
      title: homepage?.feature1Title || defaultFeatures[0].title,
      description: homepage?.feature1Description || defaultFeatures[0].description,
    },
    {
      icon: Gavel,
      title: homepage?.feature2Title || defaultFeatures[1].title,
      description: homepage?.feature2Description || defaultFeatures[1].description,
    },
    {
      icon: Headphones,
      title: homepage?.feature3Title || defaultFeatures[5].title,
      description: homepage?.feature3Description || defaultFeatures[5].description,
    },
    defaultFeatures[2],
    defaultFeatures[3],
    defaultFeatures[4],
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Por que escolher a Arremate 24 Horas?
          </h2>
          <p className="text-muted-foreground mx-auto">
            Oferecemos a melhor experiência em leilões de máquinas agrícolas, 
            com tecnologia de ponta e atendimento especializado.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}