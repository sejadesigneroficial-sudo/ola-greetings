import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  HelpCircle, 
  MessageCircle,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";

const faqCategories = [
  {
    category: "Cadastro e Participação",
    questions: [
      {
        question: "Como faço para me cadastrar na plataforma?",
        answer: "O cadastro é simples e gratuito. Clique em 'Entre ou cadastre-se' no topo da página, preencha seus dados pessoais, envie os documentos necessários (RG, CPF e comprovante de residência) e aguarde a aprovação em até 24 horas.",
      },
      {
        question: "Quem pode participar dos leilões?",
        answer: "Podem participar pessoas físicas maiores de 18 anos e pessoas jurídicas regularmente constituídas. É necessário ter cadastro aprovado na plataforma e aceitar os termos do edital.",
      },
      {
        question: "O cadastro é gratuito?",
        answer: "Sim, o cadastro na plataforma arremate24h é totalmente gratuito. Você só paga quando arrematar um lote.",
      },
      {
        question: "Quanto tempo leva para aprovar meu cadastro?",
        answer: "A análise do cadastro é realizada em até 24 horas úteis. Você receberá um e-mail confirmando a aprovação ou solicitando documentos adicionais.",
      },
    ],
  },
  {
    category: "Lances e Arrematação",
    questions: [
      {
        question: "Como dar um lance?",
        answer: "Após fazer login, acesse o lote desejado, insira o valor do lance (respeitando o incremento mínimo) e clique em 'Efetuar Lance'. Você também pode usar o WhatsApp para tirar dúvidas antes de dar o lance.",
      },
      {
        question: "Posso cancelar um lance após confirmar?",
        answer: "Não. Os lances são irrevogáveis e irretratáveis. Por isso, analise bem antes de confirmar seu lance. Em caso de desistência após arrematação, será cobrada multa de 20% do valor.",
      },
      {
        question: "O que é incremento mínimo?",
        answer: "É o valor mínimo que deve ser adicionado ao lance atual para que seu lance seja válido. Por exemplo, se o incremento é R$ 1.000 e o lance atual é R$ 100.000, seu lance deve ser de no mínimo R$ 101.000.",
      },
      {
        question: "E se houver empate no último segundo?",
        answer: "Em caso de lances no mesmo valor registrados simultaneamente, prevalece o lance que foi registrado primeiro no sistema.",
      },
    ],
  },
  {
    category: "Pagamento",
    questions: [
      {
        question: "Quais são as formas de pagamento aceitas?",
        answer: "Aceitamos PIX, transferência bancária (TED/DOC) e boleto bancário. O pagamento deve ser realizado em até 48 horas após a arrematação.",
      },
      {
        question: "Qual é a comissão cobrada?",
        answer: "A comissão do leiloeiro é de 5% sobre o valor da arrematação, mais uma taxa administrativa de 2%. Esses valores são informados no edital de cada leilão.",
      },
      {
        question: "Posso parcelar o pagamento?",
        answer: "Depende do leilão. Alguns leilões permitem parcelamento mediante análise de crédito. Consulte o edital específico ou entre em contato com nossa equipe.",
      },
      {
        question: "O que acontece se eu não pagar no prazo?",
        answer: "O não pagamento no prazo estipulado caracteriza inadimplência, podendo resultar em multa, negativação e impossibilidade de participar de futuros leilões.",
      },
    ],
  },
  {
    category: "Vistoria e Retirada",
    questions: [
      {
        question: "Posso visitar o equipamento antes do leilão?",
        answer: "Sim, recomendamos fortemente a vistoria prévia. As visitas devem ser agendadas através do nosso WhatsApp ou telefone. Os endereços e horários disponíveis estão na página de cada lote.",
      },
      {
        question: "Qual é o prazo para retirar o bem arrematado?",
        answer: "O prazo para retirada é de até 10 dias úteis após a confirmação do pagamento. Após esse prazo, será cobrada taxa de estadia diária.",
      },
      {
      question: "A arremate24h faz entrega?",
        answer: "Não realizamos entregas diretamente, mas temos parceiros de transporte que podem ser indicados. Consulte nossa página de Serviços para mais informações.",
      },
      {
        question: "O equipamento tem garantia?",
        answer: "Os bens são vendidos no estado em que se encontram (ad corpus), sem garantia. Por isso, é fundamental realizar a vistoria antes de efetuar lances.",
      },
    ],
  },
  {
    category: "Problemas e Suporte",
    questions: [
      {
        question: "O que fazer se o equipamento apresentar defeito não informado?",
        answer: "Caso identifique problemas não descritos no laudo técnico, entre em contato imediatamente com nossa equipe. Cada caso será analisado individualmente.",
      },
      {
        question: "Como entro em contato com o suporte?",
        answer: "Você pode nos contatar via WhatsApp (21) 97965-4426, telefone (21) 97965-4426, e-mail contato@arremate24h.com.br ou através do formulário na página de Contato.",
      },
      {
        question: "Qual o horário de atendimento?",
        answer: "Nosso atendimento funciona de segunda a sexta-feira, das 8h às 18h. Aos sábados, das 8h às 12h. O WhatsApp funciona 24 horas com atendimento automatizado.",
      },
    ],
  },
];

export default function FAQ() {
  const { siteSettings } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <>
      <Helmet>
        <title>Perguntas Frequentes | arremate24h</title>
        <meta name="description" content="Encontre respostas para as dúvidas mais comuns sobre os leilões da arremate24h. Cadastro, lances, pagamento e muito mais." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-xl text-primary-foreground/80 mx-auto mb-8">
              Encontre respostas rápidas para suas dúvidas
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar pergunta..."
                className="pl-10 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            {filteredCategories.length > 0 ? (
              <div className="space-y-8">
                {filteredCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-accent" />
                      {category.category}
                    </h2>
                    <Card>
                      <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                          {category.questions.map((item, itemIndex) => (
                            <AccordionItem 
                              key={itemIndex} 
                              value={`${categoryIndex}-${itemIndex}`}
                              className="border-b last:border-b-0"
                            >
                              <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/50">
                                <span className="text-left font-medium">{item.question}</span>
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-4 text-muted-foreground">
                                {item.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma pergunta encontrada para "{searchQuery}"</p>
              </div>
            )}

            {/* Contact CTA */}
            <Card className="mt-12 border-gold/30 bg-gold/5">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl mb-2">Não encontrou sua resposta?</h3>
                <p className="text-muted-foreground mb-6">
                  Nossa equipe está pronta para ajudar você com qualquer dúvida.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="gap-2 bg-[#39881e] hover:bg-[#39881e]/90 text-white"
                    onClick={() => {
                      const message = encodeURIComponent("Olá! Tenho uma dúvida sobre os leilões da arremate24h.");
                      window.open(`https://wa.me/${siteSettings?.whatsapp || '5521979654426'}?text=${message}`, '_blank');
                    }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/contato">Enviar Mensagem</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
