import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Search,
  Gavel,
  Trophy,
  CreditCard,
  Truck,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "1. Cadastre-se",
    description: "Crie sua conta gratuitamente em poucos minutos. Preencha seus dados pessoais e aceite os termos de uso.",
    details: [
      "Cadastro 100% gratuito",
      "Documentos verificados",
      "Acesso imediato aos leilões",
    ],
  },
  {
    icon: Search,
    title: "2. Encontre seu Lote",
    description: "Navegue pelos leilões ativos e encontre a máquina que você procura. Use filtros para refinar sua busca.",
    details: [
      "Fotos detalhadas dos lotes",
      "Especificações completas",
      "Histórico de manutenção",
    ],
  },
  {
    icon: Gavel,
    title: "3. Dê seu Lance",
    description: "Faça seu lance de forma simples e segura. Acompanhe em tempo real e receba notificações.",
    details: [
      "Lances em tempo real",
      "Notificações instantâneas",
      "Histórico de lances",
    ],
  },
  {
    icon: Trophy,
    title: "4. Vença o Leilão",
    description: "Se seu lance for o vencedor, você receberá uma notificação e instruções para finalizar a compra.",
    details: [
      "Confirmação imediata",
      "Documentação automática",
      "Suporte dedicado",
    ],
  },
  {
    icon: CreditCard,
    title: "5. Realize o Pagamento",
    description: "Efetue o pagamento dentro do prazo estipulado usando uma das formas de pagamento disponíveis.",
    details: [
      "Múltiplas formas de pagamento",
      "Parcelamento disponível",
      "Ambiente seguro",
    ],
  },
  {
    icon: Truck,
    title: "6. Retire seu Bem",
    description: "Após a confirmação do pagamento, agende a retirada do bem no local indicado.",
    details: [
      "Agendamento flexível",
      "Documentação em ordem",
      "Suporte na retirada",
    ],
  },
];

const faqs = [
  {
    question: "É necessário pagar para participar dos leilões?",
    answer: "Não, o cadastro e a participação nos leilões são totalmente gratuitos. Você só paga se vencer o leilão.",
  },
  {
    question: "Como sei se o equipamento está em boas condições?",
    answer: "Todos os lotes possuem descrição detalhada, fotos em alta resolução e relatório de vistoria. Além disso, é possível agendar visitas presenciais.",
  },
  {
    question: "Posso cancelar um lance?",
    answer: "Não, os lances são irrevogáveis. Por isso, verifique todas as informações antes de dar seu lance.",
  },
  {
    question: "Qual o prazo para pagamento após vencer o leilão?",
    answer: "O prazo padrão é de 48 horas úteis, conforme especificado no edital de cada leilão.",
  },
];

const ComoFunciona = () => {
  return (
    <>
      <Helmet>
        <title>Como Funciona | arremate24h</title>
        <meta 
          name="description" 
          content="Saiba como participar dos leilões de carros e motos na arremate24h. Passo a passo completo do cadastro até a retirada do veículo." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          {/* Hero */}
          <section className="bg-gradient-to-br from-forest to-forest-dark py-16 lg:py-24">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Como Funciona
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Participar dos nossos leilões é simples e seguro. Conheça o passo a passo 
                completo para arrematar sua próxima máquina agrícola.
              </p>
            </div>
          </section>

          {/* Steps */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                  <Card 
                    key={step.title} 
                    variant="elevated"
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-forest to-forest-light flex items-center justify-center mb-4 text-primary-foreground">
                        <step.icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Perguntas Frequentes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Tire suas dúvidas sobre o funcionamento dos nossos leilões.
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                  <Card 
                    key={index}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-6">
                      <h3 className="font-display font-semibold text-foreground mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 text-center">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Pronto para começar?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Cadastre-se agora e tenha acesso a centenas de máquinas agrícolas 
                com as melhores condições do mercado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gold" size="lg" asChild>
                  <Link to="/cadastro">
                    Criar Minha Conta
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/leiloes">
                    Ver Leilões Ativos
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ComoFunciona;
